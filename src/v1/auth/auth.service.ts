import { ErrorMessage } from '@common/exception';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { JWTUtil } from 'utils/jwt.util';
import { UsersService } from 'v1/users/users.service';
import { User } from 'entities';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async getAllUser(): Promise<User[]> {
    return this.usersService.getAll();
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (!user) {
      throw new UnauthorizedException(ErrorMessage.Auth_InvalidEmailPassword);
    }
    const isMatchPassword = await compare(pass, user.password);
    if (!isMatchPassword) {
      throw new UnauthorizedException(ErrorMessage.Auth_InvalidEmailPassword);
    }
    const tokenData = JWTUtil.createJWT(user);
    const cookieData = JWTUtil.createCookie(tokenData);

    return [cookieData, tokenData];
  }
  public async registerWithEmail(
    username: string,
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    dateOfBirth?: string,
    phoneNumber?: string,
    address?: string,
  ): Promise<User> {
    const existing = await this.usersService.findOne(email);
    if (existing) {
      throw new BadRequestException(ErrorMessage.Auth_EmailAlreadyRegistered);
    }

    const hashedPassword = await hash(password, 10);
    const user = await this.usersService.register(
      username,
      email,
      hashedPassword,
      firstName,
      lastName,
      dateOfBirth,
      phoneNumber,
      address,
    );
    return user;
  }
}
