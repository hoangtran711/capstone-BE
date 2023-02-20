import { IsNumber, IsString } from 'class-validator';
import { JwtConfig } from 'config';

export class ResponseTokenDto {
  @IsString()
  public token: string;

  @IsNumber()
  public expiresIn: number;

  @IsString()
  public role: string;

  public user: any;

  static fromRaw(raw: any): ResponseTokenDto {
    return {
      token: raw.token,
      user: raw.user,
      expiresIn: JwtConfig.JWT_EXPIRATION,
      role: raw.role,
    } as ResponseTokenDto;
  }
}
