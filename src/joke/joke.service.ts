import {Injectable, UnauthorizedException} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {TurnStatus} from '../enums/enums';
import {CreateJokeDto} from './dto/joke.dto';

@Injectable()
export class JokeService {

	constructor(private prismaService: PrismaService) {
	}

	async get(roomId: string){
		const room = await this.prismaService.room.findUnique({
			where: {
				id: roomId
			},
			include: {
				game: {
					include: {
						turns: {
							where: {
								status:  TurnStatus.ACTIVE
							},
							include: {
								joke: true
							}
						}
					}
				}
			}
		});

		console.log(room)


		return room
	}


	async create(gameId: string, createJokeDto: CreateJokeDto, creatingUserId) {
		const { content } = createJokeDto;

		try {
			const game = await this.prismaService.game.findUnique({
				where: { id: gameId },
			});

			if (!game) {
				throw new Error('Game not found');
			}

			const turn = await this.prismaService.turn.findFirst({
				where: { gameId: game.id, status: TurnStatus.ACTIVE },
			});

			if(turn.turnUserId !== creatingUserId){
				throw new UnauthorizedException()
			}

			if (!turn) {
				throw new Error('No turns found');
			}

			const joke = await this.prismaService.joke.create({
				data: {
					gameId: game.id,
					userId: turn.turnUserId,
					content,
					turn: { connect: { id: turn.id } },
				},
			});

			return joke;
		} catch (error) {
			console.log(error)
			throw new UnauthorizedException()
		}
	}
}
