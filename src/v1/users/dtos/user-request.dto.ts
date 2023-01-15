import { RoleEnum } from '@common/interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsEmail, IsEnum, IsString } from 'class-validator';

export class CreateUserDTO {
  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsString()
  readonly username: string;

  @ApiProperty()
  @IsString()
  readonly password: string;

  @ApiProperty()
  @IsString()
  readonly firstName: string;

  @ApiProperty()
  @IsAlphanumeric()
  readonly lastName: string;

  @ApiProperty()
  @IsString()
  readonly dateOfBirth: string;

  @ApiProperty()
  @IsString()
  readonly phoneNumber: string;

  @ApiProperty()
  @IsString()
  readonly address: string;

  @ApiProperty()
  @IsString()
  @IsEnum(RoleEnum)
  readonly role: RoleEnum;
}
