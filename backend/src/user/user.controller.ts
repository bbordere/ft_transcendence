import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthLoginDto } from 'src/auth/dtos/auth.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}


	//TODO SEND PARTIAL USER TO NOT SEND CRITICAL VALUES

	@Get()
	getUsers(){
		return (this.userService.getAllUsers());
	}

	@Get('/me')
	@UseGuards(JwtAuthGuard)
	me(@Req() req){
		const id = req.user.user.id;
		return (this.userService.getById(id));
	}

	@Get(":name")
	getUserByName(@Param('name') name: string){
		return (this.userService.getByName(name));
	}

	@Get("/id/:id")
	getUserById(@Param('id') id: number){
		return (this.userService.getById(id));
	}

	@Post()
	async createUser(@Body() user: AuthLoginDto):Promise<any>{
		return (this.userService.createUser(user));
	}
}
