import { Module } from '@nestjs/common';
import { WsGateway } from './ws.gateway';
import { RoomService } from '../room/room.service';
import { RoomModule } from '../room/room.module';
import { JokeModule } from '../joke/joke.module';
import {GameModule} from '../game/game.module';
import {TurnsService} from '../game/turns/turns.service';
import {UsersModule} from '../users/users.module';

@Module({
  imports: [RoomModule, JokeModule, GameModule, UsersModule],
  providers: [
    WsGateway
  ],
})
export class WsModule {}
