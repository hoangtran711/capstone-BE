import { IsNumber, IsString } from 'class-validator';
import { JwtConfig } from 'config';

export class ResponseTokenDto {
  @IsString()
  public token: string;

  @IsNumber()
  public expiresIn: number;

  @IsString()
  public role: string;

  static fromRaw(raw: any): ResponseTokenDto {
    return {
      token: raw.token,
      expiresIn: JwtConfig.JWT_EXPIRATION,
      role: raw.role,
    } as ResponseTokenDto;
  }
}
