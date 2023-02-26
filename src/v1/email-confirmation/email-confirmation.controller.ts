import {
  Controller,
  ClassSerializerInterceptor,
  UseInterceptors,
  Query,
  Res,
  Get,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { EmailConfirmationService } from './email-confirmation.service';

@Controller('email-confirmation')
@ApiTags('Confirmation')
@UseInterceptors(ClassSerializerInterceptor)
export class EmailConfirmationController {
  constructor(
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @ApiResponse({
    status: 200,
    description: 'Confirm Email ',
  })
  @Get('confirm')
  async confirm(@Query('token') token: string, @Res() res) {
    const email = await this.emailConfirmationService.decodeConfirmationToken(
      token,
    );
    await this.emailConfirmationService.confirmEmail(email);
    return res.redirect('http://localhost:3000/sign-in');
  }

  @Get('/confirm/admin')
  async adminConfirm(@Query('token') token: string, @Res() res) {
    const email = await this.emailConfirmationService.decodeConfirmationToken(
      token,
    );
    await this.emailConfirmationService.adminConfirm(email);
    return res.redirect('http://localhost:3000');
  }
}
