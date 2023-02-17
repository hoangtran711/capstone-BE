import GenericResponse from '@common/msg/generic-response';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterUserDTO } from 'shared';
import { AuthService } from './auth.service';
import { RequestLogInByEmailDto } from './dtos/auth-request.dto';
import { ResponseTokenDto } from './dtos/auth-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiResponse({
    status: 201,
    description: 'Register user successfully',
  })
  @ApiOperation({ summary: 'Register into system' })
  @ApiBody({ type: RegisterUserDTO })
  @Post('/register')
  async register(@Body() user: RegisterUserDTO) {
    const userCreated = await this.authService.register(user);

    return GenericResponse.success(userCreated);
  }

  @ApiResponse({
    status: 200,
    description: 'Login with email successfully',
  })
  @ApiOperation({ summary: 'Login into system' })
  @ApiBody({ type: RequestLogInByEmailDto })
  @Post('/login')
  async logIn(@Body() loginDto: RequestLogInByEmailDto) {
    const [tokenData, userRole] = await this.authService.login(loginDto);

    const data = ResponseTokenDto.fromRaw({ token: tokenData, role: userRole });

    return GenericResponse.success(data);
  }
}
