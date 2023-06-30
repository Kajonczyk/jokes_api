import {Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Req, UseGuards} from '@nestjs/common';
import {UsersService} from './users.service';
import {UserDto} from './dto/users.dto';
import {AuthGuard} from '../auth/auth.guard';

@Controller('users')
export class UsersController {

	constructor(private usersService: UsersService) {
	}


	@UseGuards(AuthGuard)
	@Get("/user")
	async getUserInfo(@Req() req){
		const user = await this.usersService.getUserInfo(req.user.id)

		if(!user) {
			throw new NotFoundException()
		}

		const {password, ...restUser} = user;

		return restUser
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
