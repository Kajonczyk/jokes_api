import {Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards} from '@nestjs/common';
import {RoomService} from './room.service';
import {CreateOrUpdateRoomDto} from './dto/room.dto';
import {AuthGuard} from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('room')
export class RoomController {


	constructor(private roomService: RoomService) {
	}

	@Get()
	get(){
		return this.roomService.get()
	}


	@Get(":id")
	getRoomInfo(@Param("id") id: string){
		return this.roomService.getRoomInfo(id)
	}

	@Post()
	create(@Body() room: CreateOrUpdateRoomDto, @Req() req){
		return this.roomService.create(room, req.user.id)
	}

	@Delete(":id")
	delete(@Param("id") id: string, @Req() req){
		return this.roomService.delete(id, req.user.id)
	}

	@Put(":id")
	put(@Param("id") id: string, @Body() room: CreateOrUpdateRoomDto, @Req() req){
		return this.roomService.put(id, room, req.user.id)
	}
}
