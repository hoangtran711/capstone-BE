import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EnvironmentConfig } from 'config';
import { AppModule } from './app.module';
import { json, urlencoded } from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  // set prefix for route
  app.setGlobalPrefix('api/v1', {
    exclude: [{ path: '/health', method: RequestMethod.ALL }],
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(json({ limit: '1mb' }));
  app.use(urlencoded({ limit: '1mb', extended: true }));

  // config swagger
  const config = new DocumentBuilder()
    .setTitle('Capstone Project')
    .setDescription('Capstone project api')
    .setVersion('1.0')
    .addBearerAuth()
    .setBasePath('api/v1')
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
  });
  SwaggerModule.setup('docs', app, document);

  await app.listen(EnvironmentConfig.PORT || 3000);
}
bootstrap();
