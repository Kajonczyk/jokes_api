import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UsersService} from '../users/users.service';
import {JwtService} from '@nestjs/jwt';
import * as bcrypt from "bcrypt"
import {UserDto} from '../users/dto/users.dto';

@Injectable()
export class AuthService {

	constructor(private usersService: UsersService) {
	}

	async login(data: UserDto){
		const user = await this.usersService.findOne({userName: data.userName})
		const doPasswordMatch = bcrypt.compareSync(data.password, user.password)

		if(!doPasswordMatch) {
			throw new UnauthorizedException()
		}
		const {password, ...userData} = user

		return userData
	}


	register(data: UserDto){
		return this.usersService.create(data)
	}
}
