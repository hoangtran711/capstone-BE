import GenericResponse from '@common/msg/generic-response';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDTO } from './dtos/user-request.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiResponse({
    status: 200,
    description: 'GET all users successfully',
  })
  @ApiOperation({ summary: 'GET All users of system' })
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
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const user = await this.usersService.findOneAndDelete(id);
    return GenericResponse.success(user);
  }

  @ApiResponse({
    status: 201,
    description: 'User has been created',
  })
  @ApiOperation({ summary: 'Create a user' })
  @ApiBody({ type: CreateUserDTO })
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
