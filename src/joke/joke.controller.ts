import {Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards} from '@nestjs/common';
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
	get(@Req() req, @Param("gameId") gameId: string, @Query() params: any){
		return this.jokeService.get(gameId, params?.all)
	}

	@Post()
	create(@Param("gameId") gameId, @Body() joke: CreateJokeDto, @Req() req){
		console.log("TUTAJ JESTEM KOX")
		return this.jokeService.create(gameId, joke.content, req.user.id)
	}

}
