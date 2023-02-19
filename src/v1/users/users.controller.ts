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
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDTO, UpdateUserDTO } from 'shared';
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
    description: 'GET all teacher successfully',
  })
  @ApiOperation({ summary: 'GET All teacher of system' })
  @ApiBearerAuth()
  @Roles(RoleEnum.Admin)
  @Get()
  async getAllTeacher() {
    const users = await this.usersService.findByRole(RoleEnum.Admin);
    return GenericResponse.success(users);
  }

  @ApiResponse({
    status: 200,
    description: 'GET all student successfully',
  })
  @ApiOperation({ summary: 'GET All student of system' })
  @ApiBearerAuth()
  @Roles(RoleEnum.Admin, RoleEnum.EndUser)
  @Get()
  async getAllStudents() {
    const users = await this.usersService.findByRole(RoleEnum.EndUser);
    return GenericResponse.success(users);
  }

  @ApiResponse({
    status: 200,
    description: 'GET detail me successfully',
  })
  @ApiOperation({ summary: 'GET Detail of users' })
  @ApiBearerAuth()
  @Roles(RoleEnum.Admin, RoleEnum.EndUser)
  @Get('/me')
  async getDetailCurrentUser(@Req() req) {
    const id = req.user.id;
    const user = await this.usersService.findOne(id);
    return GenericResponse.success(user);
  }

  @ApiResponse({
    status: 200,
    description: 'GET detail user successfully',
  })
  @ApiOperation({ summary: 'GET Detail of users' })
  @ApiBearerAuth()
  @Roles(RoleEnum.Admin, RoleEnum.EndUser)
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

  @ApiResponse({
    status: 201,
    description: 'User has been updated',
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user' })
  @ApiBody({ type: UpdateUserDTO })
  @Roles(RoleEnum.Admin, RoleEnum.EndUser)
  @Put('/me')
  async update(@Body() payload: UpdateUserDTO) {
    const user = await this.usersService.updateUser(payload);
    return GenericResponse.success(user);
  }
}
