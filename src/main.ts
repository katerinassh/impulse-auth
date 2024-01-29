import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as cookies from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveInitialized: false,
    }),
  );

  app.useGlobalPipes(new ValidationPipe());

  app.use(cookies());
  await app.listen(3000);
}
bootstrap();
