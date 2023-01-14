import { ApiProperty } from '@nestjs/swagger';
import {
  Contains,
  IsAlphanumeric,
  IsEmail,
  IsString,
  Length,
} from 'class-validator';

export class RequestLogInByEmailDto {
  @ApiProperty()
  @IsEmail()
  public email: string;

  @ApiProperty()
  @IsString()
  public password: string;
}

export class CreateUserDTO {
  @ApiProperty()
  @IsEmail()
  @Contains('@student.hcmute.edu.vn')
  readonly email: string;

  @ApiProperty()
  @IsString()
  readonly username: string;

  @ApiProperty()
  @IsString()
  readonly password: string;

  @ApiProperty()
  @IsString()
  @Length(5, 10)
  readonly firstName: string;

  @ApiProperty()
  @IsAlphanumeric()
  @Length(5, 10)
  readonly lastName: string;

  @ApiProperty()
  @IsAlphanumeric()
  readonly dateOfBirth: string;

  @ApiProperty()
  @IsString()
  readonly phoneNumber: string;

  @ApiProperty()
  @IsString()
  readonly address: string;
}
