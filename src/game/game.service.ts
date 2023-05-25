import {Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {CreateOrUpdateGameDto} from './dto/game.dto';

@Injectable()
export class GameService {

	constructor(private prismaService: PrismaService) {
	}

	async get(id: string) {

		return await this.prismaService.game.findFirst({
			where: {
				id
			}
		})

	}

	async create(game: CreateOrUpdateGameDto, roomId: string) {

		const gameToCreate = {
			...game,
			roomId,
			room: {connect: {id: roomId}}
		};

		return await this.prismaService.game.create({
			data: gameToCreate
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
