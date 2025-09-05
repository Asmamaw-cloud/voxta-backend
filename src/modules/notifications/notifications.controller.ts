import { Controller, Post, Get, Patch, Delete, Body, Param } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationType } from './enum';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Post()
  create(@Body() body: { userId: string; type: NotificationType; message: string }) {
    return this.notificationsService.createNotification(body.userId, body.type, body.message);
  }

  @Get(':userId')
  getAll(@Param('userId') userId: string) {
    return this.notificationsService.getNotifications(userId);
  }

  @Get('unread/:userId')
  getUnread(@Param('userId') userId: string) {
    return this.notificationsService.getUnreadNotifications(userId);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }

  @Delete(':id')
  softDelete(@Param('id') id: string) {
    return this.notificationsService.deleteNotification(id);
  }

  @Delete('all/:userId')
  softDeleteAll(@Param('userId') userId: string) {
    return this.notificationsService.deleteAllNotificationsForUser(userId);
  }
}
