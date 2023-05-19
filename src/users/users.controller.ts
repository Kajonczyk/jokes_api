import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {UsersService} from './users.service';
import {UserDto} from './dto/users.dto';

@Controller('users')
export class UsersController {

	constructor(private usersService: UsersService) {
	}

	@Get()
	get(){
		return this.usersService.get()
	}

	@Post()
	create(@Body() user: UserDto){
		return this.usersService.create(user)
	}

	@Delete(":id")
	delete(@Param("id") id: string){
		return this.usersService.delete(id)
	}

	@Put(":id")
	put(@Param("id") id: string, @Body() user: UserDto){
		return this.usersService.put(id, user)
	}
}
