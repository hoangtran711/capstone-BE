import { RoleEnum } from '@common/interfaces';
import GenericResponse from '@common/msg/generic-response';
import { Roles, RolesGuard } from '@common/roles';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDTO } from 'shared';
import { JwtAuthGuard } from 'v1/auth/jwt-auth.guard';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiResponse({
    status: 200,
    description: 'GET all users successfully',
  })
  @ApiOperation({ summary: 'GET All users of system' })
  @ApiBearerAuth()
  @Roles(RoleEnum.Admin)
  @Get()
  async getAllUsers() {
    const users = await this.usersService.getAll();
    return GenericResponse.success(users);
  }

  @ApiResponse({
    status: 200,
    description: 'GET detail user successfully',
  })
  @ApiOperation({ summary: 'GET Detail of users' })
  @ApiBearerAuth()
  @Roles(RoleEnum.Admin)
  @Get(':id')
  async getDetailUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    return GenericResponse.success(user);
  }

  @ApiResponse({
    status: 200,
    description: 'DELETE  user successfully',
  })
  @ApiOperation({ summary: 'Delete a user by userId' })
  @ApiBearerAuth()
  @Roles(RoleEnum.Admin)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const user = await this.usersService.findOneAndDelete(id);
    return GenericResponse.success(user);
  }

  @ApiResponse({
    status: 201,
    description: 'User has been created',
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a user' })
  @ApiBody({ type: CreateUserDTO })
  @Roles(RoleEnum.Admin)
  @Post('/create')
  async create(@Body() payload: CreateUserDTO) {
    const {
      email,
      username,
      firstName,
      lastName,
      password,
      phoneNumber,
      address,
      dateOfBirth,
      role,
    } = payload;
    const user = await this.usersService.createUser(
      username,
      email,
      password,
      firstName,
      lastName,
      dateOfBirth,
      phoneNumber,
      address,
      role,
    );
    return GenericResponse.success(user);
  }
}
