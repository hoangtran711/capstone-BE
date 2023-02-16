import GenericResponse from '@common/msg/generic-response';
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'entities';
import { Request } from 'express';
import { RegisterUserDTO } from 'shared';
import { AuthService } from './auth.service';
import { RequestLogInByEmailDto } from './dtos/auth-request.dto';
import { ResponseTokenDto } from './dtos/auth-response.dto';
import { LocalAuthGuard } from './local-auth.guard';

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
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async logIn(@Req() request: Request) {
    const user = request.user;

    const [tokenData, userRole] = await this.authService.login(user as User);

    const data = ResponseTokenDto.fromRaw({ token: tokenData, role: userRole });

    return GenericResponse.success(data);
  }
}
