import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {

  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return '<a href="http://localhost:3000/auth/signin">\
	<input type="button" value="Login" />\
 </a>\
 <p> <\p>\
 <a href="http://localhost:3000/auth/register">\
 <input type="button" value="Register" />\
</a>\
<p> <\p>\
<a href="http://localhost:3000/auth/42/callback">\
<input type="button" value="Login 42" />\
</a>';
  }
}
