import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './shared/http/http-filter-exception';
import { ZodExceptionFilter } from './shared/http/zod-filter-exception';
import cookieParser from 'cookie-parser';

async function bootstrap() {
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
  app.useGlobalFilters(new ZodExceptionFilter(), new HttpExceptionFilter());
  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap()
  .then(() => console.log('Application is running!'))
  .catch((err) => {
    console.error('Failed to start application:', err);
  });
