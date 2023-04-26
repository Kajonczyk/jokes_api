import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UsersService} from '../users/users.service';
import {JwtService} from '@nestjs/jwt';
import * as bcrypt from "bcrypt"

@Injectable()
export class AuthService {

	constructor(private usersService: UsersService) {
	}

	async login(email: string, pwd: string){
		const user = await this.usersService.findOne(email)
		const doPasswordMatch = bcrypt.compareSync(pwd, user.password)

		if(!doPasswordMatch) {
			throw new UnauthorizedException()
		}
		const {password, ...userData} = user

		return userData
	}
}
