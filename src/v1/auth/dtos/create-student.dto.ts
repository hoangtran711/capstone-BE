import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsAlphanumeric,
  Contains,
  Length,
} from 'class-validator';

export class CreateStudentDTO {
  @ApiProperty({
    default: 'trannbhoang@kms-technology.com',
  })
  @IsEmail()
  @Contains('@student.hcmute.edu.vn')
  readonly email: string;

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
}
