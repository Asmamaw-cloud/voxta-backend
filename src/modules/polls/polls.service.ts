import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreatePollDto } from './dto/create-poll.dto';
import { VotePollDto } from './dto/vote-poll.dto';
import { NotificationType } from '../notifications/enum';

@Injectable()
export class PollsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  // Create a poll
  async createPoll(dto: CreatePollDto) {
    // verify creator is a member of the chat
    const member = await this.prisma.chatMember.findUnique({
      where: { chatId_userId: { chatId: dto.chatId, userId: dto.creatorId } },
    });
    if (!member) throw new ForbiddenException('User not a member of this chat');

    const poll = await this.prisma.poll.create({
      data: {
        chatId: dto.chatId,
        question: dto.question,
        options: dto.options,
        endsAt: dto.endsAt ? new Date(dto.endsAt) : null,
      },
    });

    // notify other chat members (exclude creator)
    const otherMembers = await this.prisma.chatMember.findMany({
      where: { chatId: dto.chatId, userId: { not: dto.creatorId } },
    });

    for (const m of otherMembers) {
      await this.notificationsService.createNotification(
        m.userId,
        NotificationType.POLL,
        `New poll in the chat: "${dto.question}"`,
        // `/polls/${poll.id}`, // optional link
      );
    }

    return poll;
  }

  // Vote on a poll
  async votePoll(pollId: string, dto: VotePollDto) {
    const poll = await this.prisma.poll.findUnique({
      where: { id: pollId },
      include: { chat: { include: { members: true } }, votes: true },
    });
    if (!poll) throw new NotFoundException('Poll not found');

    // check membership
    const isMember = poll.chat.members.some(m => m.userId === dto.userId);
    if (!isMember) throw new ForbiddenException('User not in chat');

    // check duplicate vote (defensive; schema unique preferred)
    const already = poll.votes.find(v => v.userId === dto.userId);
    if (already) throw new BadRequestException('User already voted');

    // ensure chosen option is valid
    if (!poll.options.includes(dto.option)) {
      throw new BadRequestException('Invalid option');
    }

    const vote = await this.prisma.pollVote.create({
      data: {
        pollId,
        userId: dto.userId,
        option: dto.option,
      },
    });

    // notify poll creator (optional)
    // find poll creator: we don't store creator in model, notify chat members or simply all members
    const membersToNotify = poll.chat.members.filter(m => m.userId !== dto.userId);
    for (const m of membersToNotify) {
      await this.notificationsService.createNotification(
        m.userId,
        NotificationType.POLL,
        `Someone voted on poll: "${poll.question}"`,
        // `/polls/${poll.id}`,
      );
    }

    return vote;
  }

  // Get a poll with votes aggregated
  async getPoll(pollId: string) {
    const poll = await this.prisma.poll.findUnique({
      where: { id: pollId },
      include: { votes: true },
    });
    if (!poll) throw new NotFoundException('Poll not found');

    // aggregate votes per option (nice convenience)
    const counts = poll.options.reduce((acc: Record<string, number>, opt: string) => {
  acc[opt] = 0;
  return acc;
}, {} as Record<string, number>);

    for (const v of poll.votes) {
      if (counts[v.option] !== undefined) counts[v.option] += 1;
    }

    return { ...poll, results: counts };
  }

  // Get polls for a chat
  async getPollsForChat(chatId: string) {
    return this.prisma.poll.findMany({
      where: { chatId },
      include: { votes: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Optional: remove poll (admin-only in production)
  async removePoll(pollId: string) {
    await this.prisma.poll.delete({ where: { id: pollId } });
    return { message: 'Poll removed' };
  }
}
