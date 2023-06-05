import {ConflictException, Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {UserDto} from './dto/users.dto';
import * as bcrypt from "bcrypt"
@Injectable()
export class UsersService {

	constructor(private prismaService: PrismaService) {
	}

	findOne({userName, id}: {userName?: string, id?: string}) {
		const condition = userName ? {userName} : {id}
		console.log(condition)
		return this.prismaService.user.findFirst({
			where: {
				...condition
			}
		})
	}

	getUserInfo(id){
		return this.findOne({id})
	}

	async create(user: UserDto){
		const userToCreate = await this.findOne({userName: user.userName})

		console.log(userToCreate, "LPSSKSKS")
		if(userToCreate){
			throw new ConflictException("User exists")
		}

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
