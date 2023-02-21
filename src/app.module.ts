import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthModule } from 'health/health.module';
import { join } from 'path';
import { V1Module } from 'v1/v1.module';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.sendgrid.net',
        auth: {
          user: 'apikey',
          pass: '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',
        },
      },
      template: {
        dir: join(__dirname, 'mails'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    MongooseModule.forRoot(process.env.DB_CONNECTION_URL),
    V1Module,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
