import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';
import { Message } from './entities/message.entity';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { MessageController } from './controllers/message.controller';
import { User } from 'src/user/user.entity';
import { ChannelPerms } from './entities/channelPerms.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Channel, Message, User, ChannelPerms])],
  providers: [ChatGateway, ChatService],
  controllers: [MessageController, ChatController],
  exports: [ChatService],
})
export class ChatModule {}