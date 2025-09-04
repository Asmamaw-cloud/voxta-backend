import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { ChatType, ChatRole } from './enums';


@Injectable()
export class ChatsService {
  constructor(private prisma: PrismaService) {}

  async createChat(name: string | undefined, type: ChatType, creatorId: string, memberIds: string[]) {
    // Ensure creator is part of the chat
    if (!memberIds.includes(creatorId)) memberIds.push(creatorId);

    const chat = await this.prisma.chat.create({
      data: {
        name,
        type,
        members: {
          create: memberIds.map((id) => ({
            userId: id,
            role: id === creatorId ? ChatRole.ADMIN : ChatRole.MEMBER,
          })),
        },
      },
      include: { members: { include: { user: true } } },
    });

    return chat;
  }

  async addMember(chatId: string, userId: string, role: ChatRole = ChatRole.MEMBER) {
    // Check if member already exists
    const exists = await this.prisma.chatMember.findUnique({ where: { chatId_userId: { chatId, userId } } });
    if (exists) throw new BadRequestException('User already in the chat');

    return this.prisma.chatMember.create({
      data: { chatId, userId, role },
      include: { user: true },
    });
  }

  async removeMember(chatId: string, userId: string) {
    const member = await this.prisma.chatMember.findUnique({ where: { chatId_userId: { chatId, userId } } });
    if (!member) throw new NotFoundException('User not found in chat');

    return this.prisma.chatMember.delete({ where: { chatId_userId: { chatId, userId } } });
  }

  async getChatById(chatId: string) {
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        members: { include: { user: true } },
        messages: { include: { sender: true } },
      },
    });
    if (!chat) throw new NotFoundException('Chat not found');
    return chat;
  }

  async getUserChats(userId: string) {
    return this.prisma.chatMember.findMany({
      where: { userId },
      include: { chat: { include: { members: { include: { user: true } } } } },
    });
  }
}
