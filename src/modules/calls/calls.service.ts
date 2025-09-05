import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CallStatus, CallType } from './enum';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class CallsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  // Start a call
  async startCall(chatId: string, initiatorId: string, type: CallType) {
    // Check if the initiator is a chat member
    const member = await this.prisma.chatMember.findUnique({
      where: { chatId_userId: { chatId, userId: initiatorId } },
    });
    if (!member) throw new ForbiddenException('User not a member of this chat');

    const call = await this.prisma.call.create({
      data: {
        chatId,
        type,
        status: CallStatus.PENDING,
        participants: { create: [{ userId: initiatorId }] },
      },
      include: { participants: true },
    });

    // Optional: notify other members
    // await this.notificationsService.notifyChatMembers(chatId, `${member.userId} started a call`, 'CALL');

    return call;
  }

  // Join an existing call
  async joinCall(callId: string, userId: string) {
    const call = await this.prisma.call.findUnique({ where: { id: callId }, include: { participants: true, chat: { include: { members: true } } } });
    if (!call) throw new NotFoundException('Call not found');

    // Check if user is part of chat
    const isMember = call.chat.members.some(m => m.userId === userId);
    if (!isMember) throw new ForbiddenException('User not in chat');

    // Add participant if not already joined
    const existing = call.participants.find(p => p.userId === userId);
    if (!existing) {
      await this.prisma.callParticipant.create({ data: { callId, userId } });
    }

    return this.prisma.call.findUnique({ where: { id: callId }, include: { participants: true } });
  }

  // End a call
  async endCall(callId: string, userId: string) {
    const call = await this.prisma.call.findUnique({ where: { id: callId }, include: { participants: true } });
    if (!call) throw new NotFoundException('Call not found');

    await this.prisma.call.update({
      where: { id: callId },
      data: { status: CallStatus.ENDED, endedAt: new Date() },
    });

    // Optional: notify participants
    // for (const p of call.participants) {
    //   await this.notificationsService.notifyUser(p.userId, 'Call ended', 'CALL');
    // }

    return { message: 'Call ended successfully' };
  }

  // Remove participant (leave call)
  async leaveCall(callId: string, userId: string) {
    await this.prisma.callParticipant.deleteMany({ where: { callId, userId } });
    return { message: 'Left call successfully' };
  }

  // Get all calls for a chat
  async getCallsForChat(chatId: string) {
    return this.prisma.call.findMany({ where: { chatId }, include: { participants: true } });
  }
}
