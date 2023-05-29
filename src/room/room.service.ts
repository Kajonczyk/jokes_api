import {ConflictException, Injectable, UnauthorizedException, UseGuards} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {CreateOrUpdateRoomDto} from './dto/room.dto';


@Injectable()
export class RoomService {

	constructor(private prismaService: PrismaService) {
	}

	findOneByIdAndOwner(id: string, ownerId: string) {
		return this.prismaService.room.findFirstOrThrow({
			where: {
				id,
				ownerId
			}
		});
	}

	get() {
		return this.prismaService.room.findMany();
	}

	async create(room: CreateOrUpdateRoomDto, ownerId: string) {

		const doesRoomWithThisNameExist = await this.prismaService.room.findFirst({
			where: {
				name: room.name
			}
		});

		if (doesRoomWithThisNameExist) {
			throw new ConflictException('Room with this name already exists');
		}

		return this.prismaService.room.create({
			data: {...room, ownerId}
		});
	}

	async delete(id: string, userId: string) {

		const doesRoomExistAndIsUserOwner = await this.findOneByIdAndOwner(id, userId);

		if (!doesRoomExistAndIsUserOwner) {
			throw new UnauthorizedException();
		}

		return this.prismaService.room.delete({
			where: {
				id
			}
		});
	}

	async put(id: string, room: CreateOrUpdateRoomDto, userId: string) {
		const doesRoomExistAndIsUserOwner = await this.findOneByIdAndOwner(id, userId);

		if (!doesRoomExistAndIsUserOwner) {
			throw new UnauthorizedException();
		}

		return this.prismaService.room.update({
			where: {
				id
			},
			data: room
		});
	}

	async joinRoom(roomId: string, userId: string){
		await this.prismaService.room.update({
			where: { id: roomId },
			data: {
				users: {
					connect: { id: userId },
				},
				membersCount: {
					increment: 1,
				},
			},
		});
	}

	async disconnectFromRoom(roomId: string, userId: string) {
		await this.prismaService.room.update({
			where: { id: roomId },
			data: {
				users: {
					disconnect: { id: userId },
				},
				membersCount: {
					decrement: 1,
				},
			},
		});
	}


}
