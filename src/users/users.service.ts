import { Injectable } from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {UserDto} from './dto/users.dto';
import * as bcrypt from "bcrypt"
@Injectable()
export class UsersService {

	constructor(private prismaService: PrismaService) {
	}

	findOne({email, id}: {email?: string, id?: string}) {
		const condition = email ? {email} : {id}
		console.log(condition)
		return this.prismaService.user.findFirstOrThrow({
			where: {
				...condition
			}
		})
	}


	get(){
		return this.prismaService.user.findMany()
	}

	create(user: UserDto){
		const hashedPassword = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10))
		return this.prismaService.user.create({
			data: {...user, password: hashedPassword}
		})
	}

	delete(id: string){
		return this.prismaService.user.delete({
			where: {
				id
			}
		})
	}

	put(id: string, user: UserDto){
		return this.prismaService.user.update({
			where: {
				id
			},
			data: user
		})
	}



}
