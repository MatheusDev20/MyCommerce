import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './shared/http/http-filter-exception';

async function bootstrap() {
  const API_VERSION = 'v1';

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const localOrigin = {
    origin: 'http://localhost:3000',
    credentials: true,
  };

  process.env.NODE_ENV === 'production'
    ? app.enableCors()
    : app.enableCors(localOrigin);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
