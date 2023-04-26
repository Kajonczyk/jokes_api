import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import {PrismaService} from '../prisma/prisma.service';
import {TaskService} from '../task/task.service';
import {TaskController} from '../task/task.controller';

@Module({
  controllers: [TodoController, TaskController],
  providers: [TodoService, TaskService, PrismaService],
})
export class TodoModule {}
