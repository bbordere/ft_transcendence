import { Body, Controller, Get, Param, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthLoginDto } from 'src/auth/dtos/auth.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { createReadStream } from 'fs';
import { Response } from 'express';
import { join } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer, diskStorage } from 'multer';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}


	//TODO SEND PARTIAL USER TO NOT SEND CRITICAL VALUES

	@Get()
	getUsers(){
		return (this.userService.getAllUsers());
	}

	@Post('upload')
	@UseInterceptors(FileInterceptor('file', {dest: './avatars',
	// 	filename: function (req, file, cb) {
	// 		console.log(file);
	// 	cb(null, file.fieldname + '-' + Date.now())
	//   }
	}))
	uploadFile(@UploadedFile() file: Express.Multer.File) {
		console.log(file);
		return (file);
	}
	
	
	@Post('/avatar/update')
	@UseInterceptors(FileInterceptor('file', {storage: diskStorage({destination: join(process.cwd(), '/')})}))
	@UseGuards(JwtAuthGuard)
	updateAvatar(@Req() req){

	}

	@Get('/avatar/default')
	getDefaultAvatar(@Res() res: Response, @Req() req){
		const file = createReadStream(join(process.cwd(), 'avatars/default.jpg'));
		file.pipe(res)
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
