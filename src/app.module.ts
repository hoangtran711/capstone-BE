import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { V1Module } from 'v1/v1.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/nest'), V1Module],
  controllers: [],
  providers: [],
})
export class AppModule {}
