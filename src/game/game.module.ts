import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import {PrismaService} from '../prisma/prisma.service';
import {TurnsService} from './turns/turns.service';
import {TurnsController} from './turns/turns.controller';

@Module({
  controllers: [GameController, TurnsController],
  providers: [GameService, PrismaService, TurnsService]
})
export class GameModule {}
