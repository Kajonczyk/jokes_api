import {IsEmail, IsNotEmpty, IsString, MinLength} from 'class-validator';


export class UserDto {

	@IsNotEmpty()
	@MinLength(6)
	password: string;

	@IsString()
	@MinLength(3)
	userName: string;
}

