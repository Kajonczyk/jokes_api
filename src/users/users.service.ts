import { Injectable } from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {UserDto} from './dto/users.dto';
import * as bcrypt from "bcrypt"
@Injectable()
export class UsersService {

	constructor(private prismaService: PrismaService) {
	}

	findOne(email: string) {
		return this.prismaService.user.findFirstOrThrow({
			where: {
				email
			}
		})
	}


	create(user: UserDto){
		const hashedPassword = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10))
		return this.prismaService.user.create({
			data: {...user, password: hashedPassword}
		})
	}

	delete(id: number){
		return this.prismaService.user.delete({
			where: {
				id
			}
		})
	}

	put(id: number, user: UserDto){
		return this.prismaService.user.update({
			where: {
				id
			},
			data: user
		})
	}



}
