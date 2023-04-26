import {Body, Controller, Delete, Param, Post, Put} from '@nestjs/common';
import {UsersService} from './users.service';
import {UserDto} from './dto/users.dto';

@Controller('users')
export class UsersController {

	constructor(private usersService: UsersService) {
	}


	@Post()
	create(@Body() user: UserDto){
		console.log(user)
		return this.usersService.create(user)
	}

	@Delete(":id")
	delete(@Param("id") id: number){
		return this.usersService.delete(Number(id))
	}

	@Put(":id")
	put(@Param("id") id: number, @Body() user: UserDto){
		return this.usersService.put(Number(id), user)
	}
}
