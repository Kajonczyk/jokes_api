import {Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards} from '@nestjs/common';
import {CreateOrUpdateGameDto} from '../game/dto/game.dto';
import {JokeService} from './joke.service';
import {CreateJokeDto} from './dto/joke.dto';
import {AuthGuard} from '../auth/auth.guard';


@UseGuards(AuthGuard)
@Controller('game/:gameId/joke')
export class JokeController {

	constructor(private jokeService: JokeService) {
	}


	@Get()
	get(@Req() req, @Param("gameId") gameId: string){
		return this.jokeService.get(gameId)
	}

	@Post()
	create(@Param("gameId") gameId, @Body() joke: CreateJokeDto, @Req() req){
		return this.jokeService.create(gameId, joke, req.user.id)
	}
	//
	// @Delete(":id")
	// delete(@Param("id") id: string){
	// 	return this.jokeService.delete(id)
	// }
	//

}
