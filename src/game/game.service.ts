import {Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {CreateOrUpdateGameDto} from './dto/game.dto';
import {TurnsService} from '../turns/turns.service';
import {uuid} from 'uuidv4';

@Injectable()
export class GameService {

	constructor(private prismaService: PrismaService, private turnsService: TurnsService) {
	}

	async get(id: string) {

		return await this.prismaService.game.findFirst({
			where: {
				id
			}
		})

	}

	async startGame(game: CreateOrUpdateGameDto, roomId: string) {

		const gameId = uuid()

		const room = await this.prismaService.room.findFirst({
			where: {
				id: roomId
			},
			include: {
				users: true
			}
		})

		console.log(2)
		if(!room){
			return new NotFoundException()
		}

		const gameToCreate = {
			...game,
			id: gameId,
			rounds: game.rounds,
			roomId,
			room: {connect: {id: roomId}},
		};

		await this.prismaService.game.create({
			data: {...gameToCreate}
		});

		console.log(3)
		const createdTurns = await this.turnsService.createGameTurns(room.users, gameId)

		console.log(4, createdTurns)

		const mappedTurns = createdTurns.map(i => ({...i, scoreId: undefined, jokeId: undefined}))

		return await this.prismaService.game.update({
			where: {id: gameId},
			data: {
				turns: {connect: mappedTurns.map(i => ({id: i.id}))}
			}
		});
	}

	async restartGame(gameId: string, roomId: string){
		const room = await this.prismaService.room.findFirst({
			where: {
				id: roomId
			},
			include: {
				users: true
			}
		})

		const createdTurns = await this.turnsService.createGameTurns(room.users, gameId)

		const mappedTurns = createdTurns.map(i => ({...i, scoreId: undefined, jokeId: undefined}))

		return await this.prismaService.game.update({
			where: {id: gameId},
			data: {
				turns: {connect: mappedTurns.map(i => ({id: i.id}))}
			}
		});
	}

	async delete(id: string) {

		const gameToDelete = await this.prismaService.game.findFirst({
			where: {
				id
			}
		});

		if (!gameToDelete) {
			throw new NotFoundException('Game not found');
		}

		return this.prismaService.game.delete({
			where: {
				id
			}
		});
	}

	async put(id: string, data: CreateOrUpdateGameDto) {

		return await this.prismaService.game.updateMany({
			where: {
				id
			},
			data
		});
	}


}
