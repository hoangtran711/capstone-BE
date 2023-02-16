import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RequestLogInByEmailDto {
  @ApiProperty()
  public email: string;

  @ApiProperty()
  @IsString()
  public password: string;
}
