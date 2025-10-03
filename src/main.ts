import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Pipe global para validación
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // quita propiedades no definidas en el DTO
      forbidNonWhitelisted: true, // lanza error si llega una propiedad extra
      transform: true,            // transforma tipos (string -> number/date, etc.)
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
