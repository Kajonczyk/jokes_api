import {IsEmail, IsNotEmpty, IsString, MinLength} from 'class-validator';


export class UserDto {
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@MinLength(8)
	password: string;

	@IsString()
	@MinLength(6)
	userName: string;
}
