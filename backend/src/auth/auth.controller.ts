import { Body, Controller, Get, Inject, Post, Redirect, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './auth.dto';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { UserService } from 'src/user/user.service';
import { get } from 'http';
import { AuthGuard42 } from './42/42-auth.guard';
import { FortyTwoUser } from './42/42.stategy';
import { CreateUserDto } from 'src/user/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Inject(UserService)
  private readonly userService: UserService;

	@Post('/login')
	async login(@Body() authLoginDto: AuthLoginDto) {
		return this.authService.login(authLoginDto);
	}

	@Post('/register')
	async register(@Body() authLoginDto: AuthLoginDto) {
		return this.userService.createUser(authLoginDto);
	}

	@Get('/signin')
	async loginPage()
	{
		return '<form action="" method="post" class="form-example">\
				<div class="form-example">\
				<label for="name">Enter your name: </label>\
				<input type="text" name="name" id="name" required>\
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
				<label for="name">Enter your name: </label>\
				<input type="text" name="name" id="name" required>\
				</div>\
				\
				<div class="form-example">\
				<label for="email">Enter your pass: </label>\
				<input type="text" name="password" id="password" required>\
				</div>\
				<div class="form-example">\
				<input type="submit" value="Login" formaction="register">\
				</div>\
  		</form>';	
	}

	@Get('/42/callback')
	@UseGuards(AuthGuard42)
	@Redirect('http://localhost:3000', 301)
	async login42(@Req() req: any)
	{
		const token = await this.authService.login42(req.user as FortyTwoUser);
		// console.log(token);
		// this.userService.createUser({"name": user.user.username, "password":"42"});
	}
}
