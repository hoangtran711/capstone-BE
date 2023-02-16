import { IsNumber, IsString } from 'class-validator';

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
      expiresIn: raw.expiresIn,
      role: raw.role,
    } as ResponseTokenDto;
  }
}
