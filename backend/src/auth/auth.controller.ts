import { Body, Controller, Get, Inject, Post, Req, UnauthorizedException, UseGuards, Request, Response, Redirect, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dtos/auth.dto';
import { UserService } from 'src/user/user.service';
import { AuthGuard42 } from './guards/42-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { toFile } from 'qrcode';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Inject(UserService)
  private readonly userService: UserService;

	@Post('/login')
	async login(@Request() req,@Body() authLoginDto: AuthLoginDto, @Response() res) {
		const token = await this.authService.login(authLoginDto);

		res.setHeader('Set-Cookie', await this.authService.getCookieWithJwtToken(authLoginDto.email));
		req.headers.authorization = 'Bearer ' + token.access_token;
		return (res.send(token));
	}

	@Post('/register')
	async register(@Body() authLoginDto: AuthLoginDto) {
		return await this.userService.createUser(authLoginDto);
	}

	@Get('/signin')
	async loginPage()
	{
		return '<form action="" method="post" class="form-example">\
				<div class="form-example">\
				<label for="name">Enter your email: </label>\
				<input type="text" name="email" id="email" required>\
				</div>\
				\
				<div class="form-example">\
				<label for="email">Enter your pass: </label>\
				<input type="text" name="password" id="password" required>\
				</div>\
				<div class="form-example">\
				<input type="submit" value="Login" formaction="login">\
				</div>\
  		</form>';
	}

	@Get('/register')
	async registerPage()
	{
		return '<form action="" method="post" class="form-example">\
				<div class="form-example">\
				<label for="name">Enter your email: </label>\
				<input type="text" name="email" id="name" required>\
				</div>\
				\
				<label for="name">Enter your name: </label>\
				<input type="text" name="name" id="name" required>\
				</div>\
				\
				<div class="form-example">\
				<label for="pass">Enter your pass: </label>\
				<input type="text" name="password" id="password" required>\
				</div>\
				<div class="form-example">\
				<input type="submit" value="Register" formaction="register">\
				</div>\
  		</form>';	
	}

	@Get('42/callback')
	@UseGuards(AuthGuard42)
	async login42(@Req() req: any, @Res({ passthrough: true }) res: any): Promise<any>
	{
		const token = await this.authService.login42(req, res, req.user);
		return ({"access_token": token.access_token});
	}

	@Post('2fa/generate')
	@UseGuards(JwtAuthGuard)
	async generate(@Request() request) {
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
	async test(){

	}

	@Post('2fa/verify')
	@UseGuards(JwtAuthGuard)
	async verify2fa(@Req() req, @Body() body){
		if (this.authService.isValidCode(req.user.user, body.code))
			return ("Success");
		else
			return ("Failure");
	}
}
