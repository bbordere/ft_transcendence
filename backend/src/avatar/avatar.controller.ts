import { BadRequestException, Controller, Get, Param, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';
import { diskStorage } from 'multer';
import { join } from 'path';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserService } from 'src/user/user.service';

@Controller('avatar')
export class AvatarController {
	constructor(private readonly userService: UserService){}
	@Post('/update')
	@UseInterceptors(FileInterceptor('file', {
		storage: diskStorage({
			destination: join(process.cwd(), './avatars'),
			filename: (req, file, callback) => {
				const infos: string[] = file.originalname.split('.');
				const name = "avatar_" + req["user"]["user"]["id"] + "_" + infos[0];
				const extension =  "." + infos[1];
				callback(null, name + extension);
				},
			}),
		    fileFilter: (request, file, callback) => {
				if (!file.mimetype.includes('image')) {
				  return callback(new BadRequestException('Provide a valid image'), false);
				}
				callback(null, true);
			},
			limits: {
				fileSize: Math.pow(1024, 5)
			}
		}),
	)
	@UseGuards(JwtAuthGuard)
	async updateAvatar(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
		await this.userService.updatePictureLink(req["user"]["user"]["email"], "http://" + process.env.HOST + ":3000/avatar/" + file.filename);
		return (true);
	}
	
	@Get('/default')
	getDefaultAvatar(@Res() res: Response, @Req() req){
		const file = createReadStream(join(process.cwd(), 'avatars/default.jpg'));
		file.pipe(res)
	}
	
	@Get('/:file')
	@UseGuards(JwtAuthGuard)
	getIdAvatar(@Res() res: Response, @Req() req, @Param('file') file: string){
		const fileStream = createReadStream(join(process.cwd(), 'avatars/' + file));
		fileStream.pipe(res)
	}
}
