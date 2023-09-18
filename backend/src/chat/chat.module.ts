import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';
import { Message } from './entities/message.entity';
import { ChatController } from './controllers/chat.controller';
import { ChatService } from './chat.service';
import { MessageController } from './controllers/message.controller';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([Channel, Message, User])],
  providers: [ChatGateway, ChatService, UserService],
  controllers: [MessageController, ChatController],
  exports: [ChatService],
})
export class ChatModule {}