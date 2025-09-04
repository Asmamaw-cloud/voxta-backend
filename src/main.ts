import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';

dotenv.config(); // <--- load .env before Nest initializes

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable DTO validation globally
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,       // Strip unknown properties
    forbidNonWhitelisted: true, // Throw error on unknown properties
    transform: true,       // Auto-transform payloads to DTO instances
  }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
