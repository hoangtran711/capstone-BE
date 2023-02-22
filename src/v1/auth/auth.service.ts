import { ErrorMessage } from '@common/exception';
import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { User } from 'entities';
import { RegisterUserDTO } from 'shared';
import { VerifyStatus } from 'shared/enums/user.enum';
import { UsersService } from 'v1/users/users.service';
import { RequestLogInByEmailDto } from './dtos/auth-request.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailerService,
  ) {}

  async register(user: RegisterUserDTO): Promise<User> {
    const {
      username,
      firstName,
      lastName,
      password,
      dateOfBirth,
      phoneNumber,
      email,
      address,
      avatar,
      studentId,
      major,
      role,
    } = user;
    const foundUser = await this.usersService.findOneMultiple({
      $or: [{ email: email }, { username: username }],
    });
    if (foundUser) {
      throw new BadRequestException(ErrorMessage.Auth_EmailAlreadyRegistered);
    }
    const newUser: any = await this.usersService.createUser(
      username,
      email,
      password,
      firstName,
      lastName,
      dateOfBirth,
      phoneNumber,
      address,
      role,
      studentId,
      avatar,
      major,
    );
    const payload = {
      email: user.email,
      username: user.username,
      role: newUser.role,
      id: newUser._id,
    };

    const token = this.jwtService.sign(payload);
    console.log(
      `http://localhost:3001/api/v1/email-confirmation/confirm?token=${token}`,
    );
    await this.mailService.sendMail({
      to: email,
      from: 'tranhoang.finizz@gmail.com',
      subject: 'Please Verify Your Email',
      template: 'email',
      context: {
        title: 'Verify you email',
        fullName: `${firstName} ${lastName}`,
        content1: 'Please verify your email to joined our system!',
        content2: '',
        content3: '',
        content4: '',
        content5: '',
        linkUrl: `http://localhost:3001/api/v1/email-confirmation/confirm?token=${token}`,
        titleButton: 'Verify',
      },
    });

    return newUser;
  }

  async login(loginData: RequestLogInByEmailDto): Promise<any> {
    const { username, password } = loginData;
    const user = (await this.validateUser(username, password)) as any;
    const payload = {
      email: user.email,
      username: user.username,
      role: user.role,
      id: user.id,
    };
    const token = this.jwtService.sign(payload);
    if (user.emailVerified === VerifyStatus.NONE) {
      console.log(
        `http://localhost:3001/api/v1/email-confirmation/confirm?token=${token}`,
      );
      await this.mailService.sendMail({
        to: user.email,
        from: 'tranhoang.finizz@gmail.com',
        subject: 'Please Verify Your Email',
        template: 'email',
        context: {
          title: 'Verify you email',
          fullName: `${user.firstName} ${user.lastName}`,
          content1: 'Please verify your email to joined our system!',
          content2: '',
          content3: '',
          content4: '',
          content5: '',
          linkUrl: `http://localhost:3001/api/v1/email-confirmation/confirm?token=${token}`,
          titleButton: 'Verify',
        },
      });
      throw new BadRequestException('Please check your email and verify them');
    } else if (user.emailVerified === VerifyStatus.WAITING_ADMIN) {
      const payload = {
        email: user.email,
        username: process.env.ADMIN_USERNAME,
        role: user.role,
        id: user._id,
      };
      const token = this.jwtService.sign(payload);
      await this.mailService.sendMail({
        to: process.env.ADMIN_EMAIL,
        from: 'tranhoang.finizz@gmail.com',
        subject: '1 Request with role Teacher',
        template: 'email',
        context: {
          title: 'Request become teacher of your system',
          fullName: `Tran Hoang`,
          content1: `There are 1 request to become teacher of your system with name ${user.firstName} ${user.lastName}, please Verify them.`,
          content2: ``,
          content3: '',
          content4: '',
          content5: '',
          linkUrl: `http://localhost:3001/api/v1/email-confirmation/confirm/admin?token=${token}`,
          titleButton: 'Accept',
        },
      });
      throw new BadRequestException(
        'Your request is waiting for admin approve. Please patient',
      );
    }

    return [token, user.role, user];
  }
  async validateUser(username: string, pass: string): Promise<User> {
    const user = await this.usersService.findByUsernameOrEmail(username);

    if (!user) {
      throw new BadRequestException(ErrorMessage.Auth_InvalidEmailPassword);
    }
    const isMatchPassword = await compare(pass, user.password);
    if (!isMatchPassword) {
      throw new BadRequestException(ErrorMessage.Auth_InvalidEmailPassword);
    }
    return user;
  }
}
