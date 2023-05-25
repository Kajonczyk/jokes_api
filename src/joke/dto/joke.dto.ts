import {IsString} from 'class-validator';

export class CreateJokeDto {
	@IsString()
	content: string;
}
