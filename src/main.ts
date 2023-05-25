import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {PrismaService} from './prisma/prisma.service';
import {ValidationPipe} from '@nestjs/common';
import * as cookieParser from 'cookie-parser'
import * as cors from "cors"
import {CorsOptions} from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const prismaService = app.get(PrismaService)
  const corsOptions: CorsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
  };

  app.enableCors(corsOptions);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  // app.use(cors())

  await prismaService.enableShutdownHooks(app)
  await app.listen(3000);
}

bootstrap();
