import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from "cookie-parser";

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {cors: {
		origin: "http://localhost:8080",
		credentials: true,
	  }});
	app.useGlobalPipes(new ValidationPipe());
	app.use(cookieParser());
	app.enableCors({origin: "http://localhost:8080", credentials: true});

	await app.listen(3000);
}
bootstrap();
