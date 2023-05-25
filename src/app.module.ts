import {Module} from '@nestjs/common';
import {AuthModule} from './auth/auth.module';
import {UsersModule} from './users/users.module';
import {PrismaService} from "./prisma/prisma.service"
import { RoomModule } from './room/room.module';
import { GameModule } from './game/game.module';
import { JokeModule } from './joke/joke.module';
import {GameService} from './game/game.service';
import {TurnsModule} from './turns/turns.module';
@Module({
	imports: [AuthModule, UsersModule, RoomModule, GameModule, JokeModule, TurnsModule],
	exports: [GameModule],
	providers: [PrismaService]
})
export class AppModule {
}
