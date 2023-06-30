import {Body, Controller, Get, Post, Res} from '@nestjs/common';
import {AuthService} from './auth.service';
import {JwtService} from '@nestjs/jwt';
import {UserDto} from '../users/dto/users.dto';

@Controller('auth')
export class AuthController {

	constructor(private authService: AuthService, private jwtService: JwtService) {
	}

	@Post('login')
	async login(@Body() data: UserDto, @Res() res) {
		const user = await this.authService.login(data);

		const token = this.jwtService.sign({...user});

		return res.cookie('access_token', token, {
			httpOnly: true,
			domain: 'localhost',
			expires: new Date(Date.now() + 3_600_000)
		}).json(token);

	}

	@Post('register')
	async register(@Body() data: UserDto, @Res() res) {
		const registeredUser = await this.authService.register(data);
		const token = this.jwtService.sign({...registeredUser});

		return res.cookie('access_token', token, {
			httpOnly: true,
			domain: 'localhost',
			expires: new Date(Date.now() + 3_600_000)
		}).json(token);
	}

	@Get('logout')
	logout(@Res() res) {
		res.clearCookie('access_token', {
			domain: 'localhost',
			httpOnly: true
		});

		return res.json({message: 'logged out'});
	}
}
