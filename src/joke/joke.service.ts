import {Injectable, UnauthorizedException} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {TurnStatus} from '../enums/enums';

@Injectable()
export class JokeService {

	constructor(private prismaService: PrismaService) {
	}

	async get(gameId: string, queryAll = false) {

		if (queryAll) {
			return await this.prismaService.joke.findMany({
				where: {
					gameId
				}
			});
		}
		const game = await this.prismaService.game.findUnique({
			where: {
				id: gameId
			},
			include: {
				turns: {
					where: {
						status: TurnStatus.ACTIVE
					},
					include: {
						joke: true
					}
				}
			}
		});

		console.log(game)

		return game.turns[0].joke;

	}


	async create(gameId: string, content: string, creatingUserId: string) {

		try {
			const game = await this.prismaService.game.findUnique({
				where: {id: gameId}
			});

			if (!game) {
				throw new Error('Game not found');
			}

			const turn = await this.prismaService.turn.findFirst({
				where: {gameId: game.id, status: TurnStatus.ACTIVE}
			});

			console.log(turn.turnUserId, creatingUserId);

			if (turn.turnUserId !== creatingUserId) {
				throw new UnauthorizedException();
			}

			if (!turn) {
				throw new Error('No turns found');
			}

			const joke = await this.prismaService.joke.create({
				data: {
					gameId: game.id,
					userId: turn.turnUserId,
					content,
					turn: {connect: {id: turn.id}}
				}
			});

			return joke;
		} catch (error) {
			console.log(error);
			throw new UnauthorizedException();
		}
	}
}
