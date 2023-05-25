import {IsNotEmpty, IsNumber, IsString} from 'class-validator';

// @TODO FILL OBJECT
export class CreateOrUpdateGameDto {

	@IsNotEmpty()
	@IsNumber()
	rounds: number

}


