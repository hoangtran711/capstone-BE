import GenericResponse from '@common/msg/generic-response';
import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { RegisterUserDTO } from 'shared';
import { AuthService } from './auth.service';
import { RequestLogInByEmailDto } from './dtos/auth-request.dto';
import { ResponseTokenDto } from './dtos/auth-response.dto';
import { v4 as uuid } from 'uuid';
import * as path from 'path';

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
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FilesInterceptor('avatar', 1, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          // Generating a 32 random chars long string
          const fileName = uuid();
          //Calling the callback passing the random name generated with the original extension name
          cb(null, `${fileName}${path.extname(file.originalname)}`);
        },
      }),
    }),
  )
  async register(
    @Body() user: RegisterUserDTO,
    @UploadedFiles()
    avatar: Express.Multer.File[],
  ) {
    console.log(avatar);
    if (avatar) {
      user.avatar = avatar[0];
    }
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
    const [tokenData, userRole, user] = await this.authService.login(loginDto);

    const data = ResponseTokenDto.fromRaw({
      token: tokenData,
      role: userRole,
      user,
    });

    return GenericResponse.success(data);
  }
}
