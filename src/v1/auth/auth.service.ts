import { ErrorMessage } from '@common/exception';
import { RoleEnum } from '@common/interfaces';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { User } from 'entities';
import { RegisterUserDTO } from 'shared';
import { UsersService } from 'v1/users/users.service';
import { RequestLogInByEmailDto } from './dtos/auth-request.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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
    } = user;
    const foundUser = await this.usersService.findOneMultiple({
      $or: [{ email: email }, { username: username }],
    });
    if (foundUser) {
      throw new BadRequestException(ErrorMessage.Auth_EmailAlreadyRegistered);
    }
    const newUser = await this.usersService.createUser(
      username,
      email,
      password,
      firstName,
      lastName,
      dateOfBirth,
      phoneNumber,
      address,
      RoleEnum.EndUser,
    );

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
    return [token, user.role];
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
