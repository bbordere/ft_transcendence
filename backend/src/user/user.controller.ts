import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthLoginDto } from 'src/auth/dtos/auth.dto';
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	getUsers(){
		return (this.userService.getAllUsers());
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
