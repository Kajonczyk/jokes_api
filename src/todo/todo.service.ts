import {Injectable, NotFoundException} from '@nestjs/common';
import {Task, TodoList} from './todo';
import {PrismaService} from '../prisma/prisma.service';
import {TodoListDto} from './dto/todo.dto';

@Injectable()
export class TodoService {


	constructor(private prismaService: PrismaService) {
	}

	async get(userId: number){
		return await this.prismaService.list.findMany({
			where: {
				userId
			},
		})

	}

	async getById(id: number, userId: number){
		return await this.prismaService.list.findFirst({
			where: {
				userId,
				id
			}
		})
	}

	async create(todoList: TodoListDto, userId: number){

		const todoListToCreate = {
			...todoList,
			user: {connect: {id: userId}}
		}

		return await this.prismaService.list.create({
			data: todoListToCreate,
		})
	}

	async delete(id: number, userId: number){
		const listToDelete = await this.prismaService.list.findFirst({
			where: {
				id,
				userId,
			}
		});

		if(!listToDelete){
			throw new NotFoundException("List not found")
		}

		return this.prismaService.list.delete({
			where: {
				id
			}
		})
	}

	async put(id: number, name: string, userId: number){
		return await this.prismaService.list.updateMany({
			where: {
				id,
				userId,
			},
			data: {
				name
			}
		})
	}

}
