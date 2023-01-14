import GenericResponse from '@common/msg/generic-response';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDTO, RequestLogInByEmailDto } from './dtos/auth-request.dto';
import { ResponseTokenDto } from './dtos/auth-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiResponse({
    status: 200,
    description: 'GET all users successfully',
  })
  @Get('/users')
  async getAllUsers() {
    const users = await this.authService.getAllUser();
    return GenericResponse.success(users);
  }
  @ApiResponse({
    status: 201,
    description: 'Login with email successfully',
  })
  @ApiOperation({ summary: 'Login into system' })
  @ApiBody({ type: RequestLogInByEmailDto })
  @Post('/login')
  async logIn(@Body() payload: RequestLogInByEmailDto) {
    const { email, password } = payload;

    const [, tokenData] = await this.authService.validateUser(email, password);
    const data = ResponseTokenDto.fromRaw(tokenData);

    return GenericResponse.success(data);
  }

  @ApiResponse({
    status: 201,
    description: 'User has been created',
  })
  @ApiOperation({ summary: 'Create a user' })
  @ApiBody({ type: CreateUserDTO })
  @Post('/register')
  async register(@Body() payload: CreateUserDTO) {
    const {
      email,
      username,
      firstName,
      lastName,
      password,
      phoneNumber,
      address,
      dateOfBirth,
    } = payload;
    const user = await this.authService.registerWithEmail(
      username,
      email,
      password,
      firstName,
      lastName,
      dateOfBirth,
      phoneNumber,
      address,
    );
    return GenericResponse.success(user);
  }
}
