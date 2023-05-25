import {forwardRef, Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import {PrismaService} from '../../prisma/prisma.service';
import type {User} from '@prisma/client';
import {uuid} from 'uuidv4';
import {TurnStatus} from '../../enums/enums';
import {GameService} from '../game.service';

@Injectable()
export class TurnsService {

	constructor(private prismaService: PrismaService, @Inject(forwardRef(() => GameService)) private gameService: GameService) {
	}


	generateUuidList(listLength: number){
		return Array.from(Array(listLength).keys()).map(uuid)
	}

	async createGameTurns(users: User[], gameId: string){

		const uuidList = this.generateUuidList(users.length)

		const generatedTurns = uuidList.map((id, index, arr) => {

			return {
				id,
				gameId,
				turnUserId: users[index].id,
				nextTurnId: arr[index+1],
				status: index === 0 ? TurnStatus.ACTIVE : TurnStatus.CREATED,
			}
		})


		await this.prismaService.turn.createMany({
			data: generatedTurns
		})

		const turns = await this.prismaService.turn.findMany({
			where: {
				id: {
					in: generatedTurns.map((turn) => turn.id),
				},
			},
		});

		return turns
	}


	async nextTurn(gameId: string, userId: string, roomId: string){

		const turn = await this.prismaService.turn.findFirst({
			where: { gameId, status: TurnStatus.ACTIVE },
		})

		if(turn.turnUserId !== userId){
			throw new UnauthorizedException()
		}

		await this.prismaService.turn.update({
			where: { id: turn.id },
			data: {
				status: TurnStatus.COMPLETED,
			}
		})

		if(!turn.nextTurnId){
			return this.gameService.restartGame(gameId, roomId)
		}

		const newTurn = await this.prismaService.turn.update({
			where: { id: turn.nextTurnId },
			data: {
				status: TurnStatus.ACTIVE,
			}
		})

		return newTurn;
	}
}
