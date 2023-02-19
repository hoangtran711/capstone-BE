import { RoleEnum } from '@common/interfaces';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDTO {
  @ApiProperty()
  @IsEmail()
  @IsOptional()
  readonly email: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly username: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly password: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly firstName: string;

  @ApiProperty()
  @IsAlphanumeric()
  @IsOptional()
  @IsString()
  readonly lastName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly dateOfBirth: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly phoneNumber: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly address: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsEnum(RoleEnum)
  readonly role: RoleEnum;
}
export class RegisterUserDTO extends OmitType(CreateUserDTO, [
  'role',
] as const) {}

export class UpdateUserDTO extends OmitType(CreateUserDTO, ['role'] as const) {
  userId: string;
}
