import {Body, Controller, Param, Post, Req, UseGuards} from '@nestjs/common';
import {AuthGuard} from '../../auth/auth.guard';
import {JokeService} from '../../joke/joke.service';
import {TurnsService} from './turns.service';
import {NextTurnDto} from './dto/Turns.dto';

@UseGuards(AuthGuard)
@Controller('game/:gameId/turns')
export class TurnsController {
	constructor(private turnsService: TurnsService) {
	}

	@Post()
	nextTurn(@Param("gameId") gameId: string, @Req() req, @Body() data: NextTurnDto){
		return this.turnsService.nextTurn(gameId, req.user.id, data.roomId)
	}
}
