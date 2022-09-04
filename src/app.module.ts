import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthModule } from 'health/health.module';
import { V1Module } from 'v1/v1.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nest'),
    V1Module,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
