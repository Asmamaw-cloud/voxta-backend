import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ChatsModule } from './modules/chats/chats.module';
import { MessagesModule } from './modules/messages/messages.module';
import { CallsModule } from './modules/calls/calls.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { PollsModule } from './modules/polls/polls.module';
import { AiModule } from './modules/ai/ai.module';

@Module({
  imports: [AuthModule, UsersModule, ChatsModule, MessagesModule, CallsModule, NotificationsModule, TasksModule, PollsModule, AiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
