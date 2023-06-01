import { BadRequestException, Controller, Get, PipeTransform, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';
import { diskStorage } from 'multer';
import { join } from 'path';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('avatar')
export class AvatarController {
	@Post('/update')
	@UseInterceptors(FileInterceptor('file', {
		storage: diskStorage({
			destination: join(process.cwd(), './avatars'),
			filename: (req, file, callback) => {
				const name = "avatar_" + req["user"]["user"]["email"];
				const extension =  "." + file.mimetype.toString().replace("image/", "");
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
				fileSize: Math.pow(1024, 5) // 1MB
			}
		}),
	)
	@UseGuards(JwtAuthGuard)
	updateAvatar(@UploadedFile() file: Express.Multer.File) {
		//TO DO UPDATE PICTURE LINK
		console.log(file);
		return (file);
	}

	@Get('/default')
	getDefaultAvatar(@Res() res: Response, @Req() req){
		const file = createReadStream(join(process.cwd(), 'avatars/default.jpg'));
		file.pipe(res)
	}
}
