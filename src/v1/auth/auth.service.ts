import { ErrorMessage } from '@common/exception';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { JWTUtil } from 'utils/jwt.util';
import { UsersService } from 'v1/users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUsernameOrEmail(username);
    if (!user) {
      throw new UnauthorizedException(ErrorMessage.Auth_InvalidEmailPassword);
    }
    const isMatchPassword = await compare(pass, user.password);
    if (!isMatchPassword) {
      throw new UnauthorizedException(ErrorMessage.Auth_InvalidEmailPassword);
    }
    const tokenData = JWTUtil.createJWT(user);
    const cookieData = JWTUtil.createCookie(tokenData);

    return [cookieData, tokenData, user.role];
  }
}
