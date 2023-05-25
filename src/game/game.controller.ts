import {Body, Controller, Delete, Get, Param, Post, Put, Req} from '@nestjs/common';
import {GameService} from './game.service';
import {CreateOrUpdateGameDto} from './dto/game.dto';

@Controller('room/:roomId/game')
export class GameController {

	constructor(private gameService: GameService) {
	}


	@Get()
	get(@Req() req, @Param("roomId") gameId: string){
		return this.gameService.get(gameId)
	}

	@Post()
	startGame(@Body() game: CreateOrUpdateGameDto, @Param("roomId") roomId){
		console.log(1)
		return this.gameService.startGame(game, roomId)
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
