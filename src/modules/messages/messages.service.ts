import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async createMessage(userId: string, dto: CreateMessageDto) {

    if (!userId) {
    throw new Error('Missing senderId from JWT payload');
  }
    const message = await this.prisma.message.create({
      data: {
        chatId: dto.chatId,
        senderId: userId,
        content: dto.content,
        type: dto.type,
        attachments: dto.attachments || [],
        parentId: dto.parentId,
      },
      include: { sender: true, reactions: true, replies: true },
    });
    return message;
  }

  async getChatMessages(chatId: string) {
    return this.prisma.message.findMany({
      where: { chatId },
      include: { sender: true, reactions: true, replies: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getMessageById(messageId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      include: { sender: true, reactions: true, replies: true },
    });
    if (!message) throw new NotFoundException('Message not found');
    return message;
  }

  async addReaction(userId: string, messageId: string, type: string) {
    return this.prisma.reaction.create({
      data: { userId, messageId, type },
    });
  }

  async removeReaction(userId: string, messageId: string) {
    return this.prisma.reaction.deleteMany({
      where: { userId, messageId },
    });
  }
}
