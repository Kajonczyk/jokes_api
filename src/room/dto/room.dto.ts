import {IsNumber, IsString} from 'class-validator';


export class CreateOrUpdateRoomDto {

	@IsString()
	name: string;

	@IsNumber()
	membersLimit: number;

}

