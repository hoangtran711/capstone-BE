import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { JwtConfig } from 'config';
import { VerifyStatus } from 'shared/enums/user.enum';
import { RoleEnum } from '@common/interfaces';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailConfirmationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private mailService: MailerService,
  ) {}

  public async confirmEmail(email: string) {
    const user = (await this.usersService.getByEmal(email)) as any;
    if (user.emailVerified === VerifyStatus.VERIFIED) {
      throw new BadRequestException('Email already confirmed');
    }

    if (user.role === RoleEnum.EndUser) {
      return await this.usersService.verifyEmail(email, VerifyStatus.VERIFIED);
    }
    const payload = {
      email: user.email,
      username: 'trannbhoang',
      role: user.role,
      id: user._id,
    };
    const token = this.jwtService.sign(payload);
    await this.mailService.sendMail({
      to: 'trannbhoang@kms-technology.com',
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
    return await this.usersService.verifyEmail(
      email,
      VerifyStatus.WAITING_ADMIN,
    );
  }

  async adminConfirm(email: string) {
    const user = await this.usersService.getByEmal(email);
    console.log(user);
    await this.mailService.sendMail({
      to: user.email,
      from: 'tranhoang.finizz@gmail.com',
      subject: 'Your email is accepted join our system',
      template: 'email',
      context: {
        title: 'Congratulations',
        fullName: `${user.firstName} ${user.lastName}`,
        content1:
          'Your request has been accepted by our Admin. Let Login to our system now',
        content2: '',
        content3: '',
        content4: '',
        content5: '',
        linkUrl: `http://localhost:3000//sign-in`,
        titleButton: 'Login',
      },
    });
    return await this.usersService.verifyEmail(email, VerifyStatus.VERIFIED);
  }

  public async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: JwtConfig.JWT_SECRET,
      });

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }
}
