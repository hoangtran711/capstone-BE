import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfig } from 'config';
import { UsersModule } from 'v1/users/users.module';
import { EmailConfirmationController } from './email-confirmation.controller';
import { EmailConfirmationService } from './email-confirmation.service';

@Module({
  imports: [
    JwtModule.register({
      secret: JwtConfig.JWT_SECRET,
      signOptions: { expiresIn: JwtConfig.JWT_EXPIRATION },
    }),
    UsersModule,
  ],
  providers: [EmailConfirmationService],
  controllers: [EmailConfirmationController],
})
export class EmailConfirmationModule {}
