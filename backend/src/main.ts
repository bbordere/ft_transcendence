import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from "cookie-parser";

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {cors: {
		origin: "http://" + process.env.HOST + ":8080",
		credentials: true,
	  }});
	// const app = await NestFactory.create<NestExpressApplication>(AppModule);
	const allowedDomains = ["http://localhost:8080", "http://" + process.env.HOST + ":8080"];
	// app.enableCors({origin: allowedDomains, credentials: true});
	app.useGlobalPipes(new ValidationPipe());
	app.use(cookieParser());


	await app.listen(3000);
}
bootstrap();
