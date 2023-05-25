import { Module } from '@nestjs/common';
import { TurnsService } from './turns.service';
import {PrismaService} from '../prisma/prisma.service';
import { TurnsController } from './turns.controller';
import {GameService} from '../game/game.service';
import {GameModule} from '../game/game.module';

@Module({
  providers: [TurnsService, PrismaService,  GameService],
  controllers: [TurnsController]
})
export class TurnsModule {}
