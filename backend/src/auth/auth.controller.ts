import { Body, Controller, Get, Inject, Post, Req, UnauthorizedException, UseGuards, Redirect, Res, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dtos/auth.dto';
import { UserService } from 'src/user/user.service';
import { AuthGuard42 } from './guards/42-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Request, Response } from 'express';
import { toFile } from 'qrcode';
import { AuthLogin42Dto } from './dtos/auth42.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Inject(UserService)
  private readonly userService: UserService;

	@Get('logout')
	async logout(@Res({ passthrough: true }) res: Response){
		res.cookie('access_token', '', {expires: new Date()});
	}

	@Get('/42/login')
	@UseGuards(AuthGuard42)
	login42(){}
	
	@Get('/42/callback')
	@UseGuards(AuthGuard42)
	async generateToken(@Res({passthrough: true}) res: Response, @Req() req: any){
		const tokens: string = await this.authService.getTokenByUser(req.user);
		if (req.user.auth2f)
			res.redirect('http://localhost:8080/verif');
		else {
			res.cookie('access_token', tokens, {httpOnly: true});
			res.redirect('http://localhost:8080/');
		}
	}

	@Post('/login')
	async login(@Req() req: Request, @Body() authLoginDto: AuthLoginDto, @Res() res) {
		console.log(req.cookies);
		const tokens = await this.authService.login(authLoginDto, res);
		res.cookie('access_token', tokens.access_token, {httpOnly: true});
		return (res.send(tokens.access_token));
		// if (user.auth2f)
		// 	// res.redirect('http://localhost:8080/verif');
		// else
		// 	res.redirect('http://localhost:8080/');
	}

	@Post()
	@UseGuards(JwtAuthGuard)
	async checkLoginStatus(){
		return ({ "statusCode": 200});
	}

	@Post('/register')
	async register(@Req() req, @Body() authLoginDto: AuthLoginDto, @Res() res) {
		const user = await this.userService.createUser(authLoginDto);
		const tokens: string = await this.authService.getTokenByUser(user);
		res.cookie('access_token', tokens, {httpOnly: true});
		res.redirect('http://localhost:8080/');
	}

	@Post('2fa/generate')
	@UseGuards(JwtAuthGuard)
	async generate(@Req() request) {
		const { otpAuthUrl } = await this.authService.generate2FASecret(request.user.user);
		toFile('qrcode/code.png', otpAuthUrl);
		let QRCode = await this.authService.generateQrCode(otpAuthUrl);
		return (QRCode);
	}

	@Post('2fa/on')
	@UseGuards(JwtAuthGuard)
	async enable2fa(@Req() req, @Body() body) {
		const isCodeValid = this.authService.isValidCode(req.user.user, body.code);
		if (!isCodeValid)
			throw new UnauthorizedException('Wrong authentication code');
		await this.userService.enable2fa(req.user.user.id);
		return ("success");
	}

	@Post('2fa/off')
	@UseGuards(JwtAuthGuard)
	async disable2fa(@Req() req, @Body() body) {
		const isCodeValid = this.authService.isValidCode(req.user.user, body.code);
		if (!isCodeValid)
			throw new UnauthorizedException('Wrong authentication code');
		await this.userService.disable2fa(req.user.user.id);
		return ("success");
	}

	@Get('2fa/qrcode')
	@UseGuards(JwtAuthGuard)
	@Redirect("/qrcode/code.png")
	async test(){}
	
	@Post('2fa/verify')
	@UseGuards(JwtAuthGuard)
	async verify2fa(@Req() req: any, @Body() body, @Res() res){
		if (this.authService.isValidCode(req.user.user, body.code)){
			const tokens: string = await this.authService.getTokenByUser(req.user.user);
			res.cookie('access_token', tokens, {httpOnly: true});
			return (res.send("Success"));
		}
		else
			return (res.send("Failure"));
	}


	// @Get('/signin')
	// async loginPage()
	// {
	// 	return '<form action="" method="post" class="form-example">\
	// 			<div class="form-example">\
	// 			<label for="name">Enter your email: </label>\
	// 			<input type="text" name="email" id="email" required>\
	// 			</div>\
	// 			\
	// 			<div class="form-example">\
	// 			<label for="email">Enter your pass: </label>\
	// 			<input type="text" name="password" id="password" required>\
	// 			</div>\
	// 			<div class="form-example">\
	// 			<input type="submit" value="Login" formaction="login">\
	// 			</div>\
  	// 	</form>';
	// }

	// @Get('/register')
	// async registerPage()
	// {
	// 	return '<form action="" method="post" class="form-example">\
	// 			<div class="form-example">\
	// 			<label for="name">Enter your email: </label>\
	// 			<input type="text" name="email" id="name" required>\
	// 			</div>\
	// 			\
	// 			<label for="name">Enter your name: </label>\
	// 			<input type="text" name="name" id="name" required>\
	// 			</div>\
	// 			\
	// 			<div class="form-example">\
	// 			<label for="pass">Enter your pass: </label>\
	// 			<input type="text" name="password" id="password" required>\
	// 			</div>\
	// 			<div class="form-example">\
	// 			<input type="submit" value="Register" formaction="register">\
	// 			</div>\
  	// 	</form>';	
	// }
}
