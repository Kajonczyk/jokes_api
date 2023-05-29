import { Module } from '@nestjs/common';
import { JokeController } from './joke.controller';
import { JokeService } from './joke.service';
import {PrismaService} from '../prisma/prisma.service';

@Module({
  controllers: [JokeController],
  exports: [JokeService],
  providers: [JokeService, PrismaService]
})
export class JokeModule {}
