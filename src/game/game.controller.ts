import {Body, Controller, Delete, Get, Param, Post, Put, Req} from '@nestjs/common';
import {GameService} from './game.service';
import {CreateOrUpdateGameDto} from './dto/game.dto';

@Controller('game/:gameId')
export class GameController {

	constructor(private gameService: GameService) {
	}

	@Get()
	get(@Req() req, @Param("gameId") gameId: string){
		return this.gameService.get(gameId)
	}

	@Get("/points")
	getPoints(@Param("gameId") gameId: string){
		return this.gameService.getGamePoints(gameId)
	}

	@Post()
	startGame(@Body() game: CreateOrUpdateGameDto, @Param("gameId") gameId){
		return this.gameService.startGame(game, gameId)
	}

	@Delete(":id")
	delete(@Param("id") id: string){
		return this.gameService.delete(id)
	}

	@Put(":id")
	put(@Param("id") id: string, @Body() game: CreateOrUpdateGameDto){
		return this.gameService.put(id, game)
	}
	
	
}
