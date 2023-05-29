import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import {GameService} from './game.service';
import {CreateOrUpdateGameDto} from './dto/game.dto';
import { AuthGuard } from '../auth/auth.guard';


@UseGuards(AuthGuard)
@Controller('game')
export class GameController {

	constructor(private gameService: GameService) {
	}

	@Get(":gameId")
	get(@Req() req, @Param("gameId") gameId: string){
		return this.gameService.get(gameId)
	}

	@Get(":gameId/points")
	getPoints(@Param("gameId") gameId: string){
		return this.gameService.getGamePoints(gameId)
	}

	@Post()
	startGame(@Body() game: CreateOrUpdateGameDto, @Req() req){
		return this.gameService.startGame(game, req.user.id)
	}

	@Delete(":gameId")
	delete(@Param("gameId") id: string){
		return this.gameService.delete(id)
	}

	@Put(":gameId")
	put(@Param("gameId") id: string, @Body() game: CreateOrUpdateGameDto){
		return this.gameService.put(id, game)
	}
	
	
}
