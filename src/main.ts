import { RequestMethod } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // set prefix for route
  app.setGlobalPrefix('api/v1', {
    exclude: [{ path: '/health', method: RequestMethod.ALL }],
  });

  // config swagger
  const config = new DocumentBuilder()
    .setTitle('Capstone Project')
    .setDescription('Capstone project api')
    .setVersion('1.0')
    .setBasePath('api/v1')
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
  });
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}
bootstrap();
