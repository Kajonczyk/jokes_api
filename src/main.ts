import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {PrismaService} from './prisma/prisma.service';
import {ValidationPipe} from '@nestjs/common';
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const prismaService = app.get(PrismaService)
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  await prismaService.enableShutdownHooks(app)
  await app.listen(3000);
}

bootstrap();
