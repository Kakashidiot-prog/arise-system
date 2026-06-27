import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Enable Global Val pipe\
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips out any extra properties not defined in the DTO
    }),
  );

  app.enableCors({
    origin: 'http://localhost:5173', // Replace with frontend URL
    credentials: true,
  });
  await app.listen(process.env.Port ?? 3000);
}
bootstrap();