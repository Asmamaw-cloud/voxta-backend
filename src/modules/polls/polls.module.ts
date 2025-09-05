import { Module } from '@nestjs/common';
import { PollsService } from './polls.service';
import { PollsController } from './polls.controller';
import { PrismaService } from '../../database/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Module({
  imports: [],
  controllers: [PollsController],
  providers: [PollsService, PrismaService, NotificationsService],
})
export class PollsModule {}
