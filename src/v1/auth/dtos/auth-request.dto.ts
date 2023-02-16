import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RequestLogInByEmailDto {
  @ApiProperty()
  public username: string;

  @ApiProperty()
  @IsString()
  public password: string;
}
