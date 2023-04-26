import {IsNotEmpty} from 'class-validator';


export class TodoListDto {

	@IsNotEmpty()
	name: string
}
