import {IsNumber, IsString} from 'class-validator';


export class CreateOrUpdateRoomDto {

	id: string;

	@IsString()
	name: string;

	@IsNumber()
	membersLimit: number;

}

