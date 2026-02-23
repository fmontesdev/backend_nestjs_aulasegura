import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Configuración de CORS
  const defaultOrigins = [
    'http://localhost:8081',
    'http://localhost:19006',
  ];
  const extraOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim())
    : [];
  const allowedOrigins = [...defaultOrigins, ...extraOrigins];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Pipe global para validación
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // quita propiedades no definidas en el DTO
      forbidNonWhitelisted: true, // lanza error si llega una propiedad extra
      transform: true,            // transforma tipos (string -> number/date, etc.)
      transformOptions: { enableImplicitConversion: true }, // permite conversiones implícitas
    }),
  );

  // Config de Swagger
  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    const config = new DocumentBuilder()
      .setTitle('AulaSegura API')
      .setDescription('Documentación del backend Nest.js de AulaSegura')
      .setVersion('1.0.0')
      .addBearerAuth()  // Si usas JWT/Bearer
      // .addServer('http://localhost:8080') // opcional
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });

    // Si interesa exportar el JSON en dev:
    // import { writeFileSync } from 'fs';
    // writeFileSync('./openapi.json', JSON.stringify(document, null, 2));
  }

  const webserverPort = process.env.WEB_SERVER_PORT || '8000';
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Server running on port ${webserverPort}. Swagger ${isDev ? 'enabled at /docs' : 'disabled'}`);
}
bootstrap();
