import {IsNotEmpty, IsString} from 'class-validator';

export class NextTurnDto {
	@IsString()
	@IsNotEmpty()
	roomId: string;
}
