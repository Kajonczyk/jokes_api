import {Body, Controller, Get, Post, Res} from '@nestjs/common';
import {AuthService} from './auth.service';
import {JwtService} from '@nestjs/jwt';

@Controller('auth')
export class AuthController {

	constructor(private authService: AuthService, private jwtService: JwtService) {
	}

	@Post('login')
	async login(@Body() data: any, @Res() res) {
		const user = await this.authService.login(data.email, data.password);

		const token = this.jwtService.sign({id: user.id, name: user.email});

		return res.cookie('access_token', token, {
			httpOnly: true,
			domain: 'localhost',
			expires: new Date(Date.now() + 3_600_000)
		}).json(user);

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
