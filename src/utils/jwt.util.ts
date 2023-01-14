import { sign } from 'jsonwebtoken';
import { pick } from 'lodash';

import { CookieData, DataStoredInToken, TokenData } from '@common/interfaces';
import { JwtConfig } from 'config';

export class JWTUtil {
  static createJWT(data: DataStoredInToken): TokenData {
    const token = sign(
      pick(data, ['uid', 'email', 'username', 'role']),
      JwtConfig.JWT_SECRET,
      {
        expiresIn: JwtConfig.JWT_EXPIRATION,
        notBefore: 0,
        issuer: JwtConfig.JWT_ISSUER,
      },
    );

    return { token, expiresIn: JwtConfig.JWT_EXPIRATION } as TokenData;
  }

  static createCookie(tokenData: TokenData): CookieData {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}
