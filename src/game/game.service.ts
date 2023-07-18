import {ConflictException, Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {CreateOrUpdateGameDto} from './dto/game.dto';
import {TurnsService} from './turns/turns.service';
import {uuid} from 'uuidv4';
import {TurnStatus} from '../enums/enums';

@Injectable()
export class GameService {

	constructor(private prismaService: PrismaService, private turnsService: TurnsService) {
	}

	async get(id: string) {

		return await this.prismaService.game.findFirst({
			where: {
				id
			},
			include: {
				turns: {
					include: {
						joke: true
					}
				}
			}
		});

	}

	async addGamePoints(gameId: string, userId: string, amount: number, turnId: string) {
		const currentTurn = await this.prismaService.turn.findFirst({
			where: {
				id: turnId
			}
		})

		await this.prismaService.score.create({
			data: {gameId, userId: currentTurn.turnUserId, amount, turn: {connect: {id: turnId}}}
		});

		return {
			amount, userId,
		}


	}


	async getGamePoints(id: string) {
		const scores = await this.prismaService.score.findMany({
			where: {
				gameId: id
			}
		});

		const scoreByPlayer = scores.reduce((acc, curr) => {
			const {userId, amount} = curr;
			acc[userId] = (acc[userId] || 0) + amount;
			return acc;
		}, {});

		const userIds = Object.entries(scoreByPlayer).map(([userId]) => userId);

		const users = await this.prismaService.user.findMany({
			where: {
				id: {
					in: userIds
				}
			},
			select: {
				userName: true,
				id: true
			}
		});

		return users.map(user => ({...user, score: scoreByPlayer[user.id]}));
	}

	async startGame(game: CreateOrUpdateGameDto, userId: string) {

		const gameId = uuid();

		const room = await this.prismaService.room.findFirst({
			where: {
				id: game.roomId
			},
			include: {
				users: true
			}
		});

		if (!room) {
			return new NotFoundException();
		}

		if (room.ownerId !== userId) {
			throw new UnauthorizedException();
		}

		if (room.gameId) {
			return new ConflictException();
		}

		const gameToCreate = {
			...game,
			id: gameId,
			rounds: game.rounds,
			roomId: game.roomId,
			room: {connect: {id: game.roomId}}
		};

		await this.prismaService.game.create({
			data: {...gameToCreate}
		});

		const createdTurns = await this.turnsService.createGameTurns(room.users, gameId);

		console.log(4, createdTurns);

		const mappedTurns = createdTurns.map(i => ({...i, scoreId: undefined, jokeId: undefined}));

		return await this.prismaService.game.update({
			where: {id: gameId},
			data: {
				turns: {connect: mappedTurns.map(i => ({id: i.id}))}
			},
			include: {
				turns: true
			}
		});
	}

	async restartGame(gameId: string, roomId: string) {
		const room = await this.prismaService.room.findFirst({
			where: {
				id: roomId
			},
			include: {
				users: true
			}
		});

		const currentGame = await this.prismaService.game.findFirst({
			where: {
				id: gameId
			}
		});

		if (currentGame.roundsCount === currentGame.rounds) {
			await this.prismaService.game.update({
				where: {id: gameId},
				data: {
					finishedAt: new Date()
				}
			});
			return {gameOver: true};
		}


		const createdTurns = await this.turnsService.createGameTurns(room.users, gameId);

		const mappedTurns = createdTurns.map(i => ({...i, scoreId: undefined, jokeId: undefined}));

		await this.prismaService.game.update({
			where: {id: gameId},
			data: {
				turns: {connect: mappedTurns.map(i => ({id: i.id}))},
				roundsCount: {increment: 1}
			}
		});

		return this.prismaService.turn.findFirst({
			where: {gameId, status: TurnStatus.ACTIVE}
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
