import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CallStatus, CallType } from './enum';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/enum';

@Injectable()
export class CallsService {
    constructor(
        private prisma: PrismaService,
        private notificationsService: NotificationsService,
    ) { }

    // Start a call
    async startCall(chatId: string, initiatorId: string, type: CallType) {
        // Check if the initiator is a chat member
        const member = await this.prisma.chatMember.findUnique({
            where: { chatId_userId: { chatId, userId: initiatorId } },
            include: { user: true },
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


        // Notify all other chat members
        const chatMembers = await this.prisma.chatMember.findMany({
            where: { chatId, userId: { not: initiatorId } },
        });

        for (const m of chatMembers) {
            await this.notificationsService.createNotification(
                m.userId,
                NotificationType.CALL,
                `${member.user.name} started a ${type.toLowerCase()} call`,
            );
        }

        return call;
    }

    // Join an existing call
    async joinCall(callId: string, userId: string) {
        const call = await this.prisma.call.findUnique({
            where: { id: callId },
            include: {
                participants: true,
                chat: { include: { members: { include: { user: true } } } } // include user
            }
        });
        if (!call) throw new NotFoundException('Call not found');

        const isMember = call.chat.members.some(m => m.userId === userId);
        if (!isMember) throw new ForbiddenException('User not in chat');

        const existing = call.participants.find(p => p.userId === userId);
        if (!existing) {
            await this.prisma.callParticipant.create({ data: { callId, userId } });
        }

        // Notify other participants
        const joiningUser = call.chat.members.find(m => m.userId === userId)?.user;
        const otherParticipants = call.participants.filter(p => p.userId !== userId);

        for (const p of otherParticipants) {
            await this.notificationsService.createNotification(
                p.userId,
                NotificationType.CALL,
                `${joiningUser?.name} joined the call`,
            );
        }

        return this.prisma.call.findUnique({ where: { id: callId }, include: { participants: true } });
    }


    // End a call
    async endCall(callId: string, userId: string) {
        const call = await this.prisma.call.findUnique({
            where: { id: callId },
            include: { participants: { include: { user: true } } } // include user for notifications
        });
        if (!call) throw new NotFoundException('Call not found');

        await this.prisma.call.update({
            where: { id: callId },
            data: { status: CallStatus.ENDED, endedAt: new Date() },
        });

        const endingUser = call.participants.find(p => p.userId === userId)?.user;

        for (const p of call.participants) {
            if (p.userId !== userId) {
                await this.notificationsService.createNotification(
                    p.userId,
                    NotificationType.CALL,
                    `Call ended by ${endingUser?.name}`,
                );
            }
        }

        return { message: 'Call ended successfully' };
    }


    // Remove participant (leave call)
    async leaveCall(callId: string, userId: string) {
        await this.prisma.callParticipant.deleteMany({ where: { callId, userId } });

        // Notify remaining participants
        const remainingParticipants = await this.prisma.callParticipant.findMany({
            where: { callId },
            include: { user: true } // include user for proper notification message
        });

        const leavingUser = await this.prisma.user.findUnique({ where: { id: userId } });

        for (const p of remainingParticipants) {
            await this.notificationsService.createNotification(
                p.userId,
                NotificationType.CALL,
                `${leavingUser?.name} left the call`,
            );
        }

        return { message: 'Left call successfully' };
    }


    // Get all calls for a chat
    async getCallsForChat(chatId: string) {
        return this.prisma.call.findMany({ where: { chatId }, include: { participants: true } });
    }
}
