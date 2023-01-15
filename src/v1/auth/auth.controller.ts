import GenericResponse from '@common/msg/generic-response';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RequestLogInByEmailDto } from './dtos/auth-request.dto';
import { ResponseTokenDto } from './dtos/auth-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiResponse({
    status: 200,
    description: 'GET all users successfully',
  })
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
}
