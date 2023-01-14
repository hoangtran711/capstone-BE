import { IsString } from 'class-validator';

export class ResponseTokenDto {
  @IsString()
  public token: string;

  @IsString()
  public expiresIn: number;

  static fromRaw(raw: any): ResponseTokenDto {
    return {
      token: raw.token,
      expiresIn: raw.expiresIn,
    } as ResponseTokenDto;
  }
}
