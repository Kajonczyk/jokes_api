import {Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {TaskDto} from './dto/task.dto';

@Injectable()
export class TaskService {

	constructor(private prismaService: PrismaService) {
	}


	async throwIfNotListOwner(userId: number, listId: number) {
		const list = await this.prismaService.list.findFirst({
			where: {
				userId,
				id: listId
			}
		});

		if (!list || list.userId !== userId) {
			throw new UnauthorizedException();
		}
	}

	async get(userId: number, id: number) {
		await this.throwIfNotListOwner(userId, id);

		return await this.prismaService.task.findMany({
			where: {
				todoListId: id
			}
		});

	}

	async create(task: TaskDto, userId: number, id: number) {

		await this.throwIfNotListOwner(userId, id);

		const taskToCreate = {
			...task,
			list: {connect: {id}}
		};

		return await this.prismaService.task.create({
			data: taskToCreate
		});
	}

	async delete(listId: number, userId: number, id: number) {
		await this.throwIfNotListOwner(userId, listId);

		const taskToDelete = await this.prismaService.task.findFirst({
			where: {
				id
			}
		});

		if (!taskToDelete) {
			throw new NotFoundException('Task not found');
		}

		return this.prismaService.task.delete({
			where: {
				id
			}
		});
	}

	async put(listId: number, userId: number, id: number, data: TaskDto) {

		await this.throwIfNotListOwner(userId, listId);

		return await this.prismaService.task.updateMany({
			where: {
				id
			},
			data
		});
	}


}
