import {Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards} from '@nestjs/common';
import {TodoService} from './todo.service';
import {AuthGuard} from '../auth/auth.guard';
import {TodoListDto} from './dto/todo.dto';

@Controller('todo')
@UseGuards(AuthGuard)
export class TodoController {

	constructor(private todoService: TodoService) {
	}

	@Get()
	async get(@Req() req){
		const lists = await this.todoService.get(req.user.id)
		return lists || []
	}

	@Get(":id")
	getById(@Param("id") id, @Req() req){
		return this.todoService.getById(Number(id), req.user.id)
	}

	@Post()
	create(@Body() todoList: TodoListDto, @Req() req){
		return this.todoService.create(todoList, req.user.id)
	}

	@Delete(":id")
	delete(@Param("id") id: number, @Req() req){
		return this.todoService.delete(Number(id), req.user.id)
	}

	@Put(":id")
	put(@Param("id") id: number, @Body() data: TodoListDto, @Req() req){
		return this.todoService.put(Number(id), data.name, req.user.id)
	}
}

