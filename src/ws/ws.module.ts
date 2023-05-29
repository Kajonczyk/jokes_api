import { Module } from '@nestjs/common';
import { WsGateway } from './ws.gateway';
import { RoomService } from '../room/room.service';
import { RoomModule } from '../room/room.module';
import { JokeModule } from '../joke/joke.module';

@Module({
  imports: [RoomModule, JokeModule],
  providers: [
    WsGateway
  ],
})
export class WsModule {}
