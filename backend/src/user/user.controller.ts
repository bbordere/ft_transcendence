import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './user.dto';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	getUsers(){
		return (this.userService.getAllUsers());
	}

	@Get(":name")
	getUserByName(@Param() params: CreateUserDto){
		return (this.userService.getByName(params.name));
	}

	@Get(":id")
	getUserById(@Param('id') id: number){
		return (this.userService.getById(id));
	}

	@Post()
	async createUser(@Body() user: CreateUserDto):Promise<any>{
		return (this.userService.createUser(user));
	}


}
