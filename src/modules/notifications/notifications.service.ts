import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { NotificationType } from './enum';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  // Create a notification
  async createNotification(
    userId: string,
    type: NotificationType,
    message: string,
  ) {
    return this.prisma.notification.create({
      data: { userId, type, message },
    });
  }

  // Get all notifications for a user
  async getNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId, deleted: false },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get unread notifications for a user
  async getUnreadNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId, read: false, deleted: false },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Mark a notification as read
  async markAsRead(notificationId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });
    if (!notification || notification.deleted) {
      throw new NotFoundException('Notification not found');
    }

    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });
  }

  // Soft delete a notification
  async deleteNotification(notificationId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });
    if (!notification || notification.deleted) {
      throw new NotFoundException('Notification not found');
    }

    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { deleted: true },
    });
  }

  // Optional: delete all notifications for a user (soft delete)
  async deleteAllNotificationsForUser(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, deleted: false },
      data: { deleted: true },
    });
  }
}
