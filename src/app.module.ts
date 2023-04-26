import {Module} from '@nestjs/common';
import {AuthModule} from './auth/auth.module';
import {UsersModule} from './users/users.module';
import { TodoModule } from './todo/todo.module';
import {PrismaService} from './prisma/prisma.service';
import { TaskModule } from './task/task.module';

@Module({
	imports: [AuthModule, UsersModule, TodoModule, TaskModule],
	providers: [PrismaService]
})
export class AppModule {
}
