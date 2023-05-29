import {IsNotEmpty, IsNumber, IsString} from 'class-validator';

export class CreateOrUpdateGameDto {

	@IsNotEmpty()
	@IsNumber()
	rounds: number

	@IsNotEmpty()
	@IsString()
	roomId: string

}


