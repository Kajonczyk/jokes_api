import {Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards} from '@nestjs/common';
import {TaskService} from './task.service';
import {AuthGuard} from '../auth/auth.guard';
import {TaskDto} from './dto/task.dto';

@UseGuards(AuthGuard)
@Controller('todo/:listId/tasks')
export class TaskController {

	constructor(private taskService: TaskService) {
	}

	@Get()
	get(@Req() req, @Param('listId') listId: number) {
		return this.taskService.get(req.user.id, Number(listId));
	}

	@Post()
	create(@Body() task: TaskDto, @Param('listId') listId: number, @Req() req) {
		return this.taskService.create(task, req.user.id, Number(listId));
	}

	@Delete(':id')
	delete(@Param('listId') listId: number, @Req() req, @Param('id') id: number) {
		return this.taskService.delete(Number(listId), req.user.id, Number(id));
	}

	@Put(":id")
	put(@Param('listId') listId: number, @Req() req, @Param('id') id: number, @Body() data: TaskDto) {
		return this.taskService.put(Number(listId), req.user.id, Number(id), data);
	}

}
