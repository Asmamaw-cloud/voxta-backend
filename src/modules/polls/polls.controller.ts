import { Controller, Post, Body, Param, Get, Delete } from '@nestjs/common';
import { PollsService } from './polls.service';
import { CreatePollDto } from './dto/create-poll.dto';
import { VotePollDto } from './dto/vote-poll.dto';

@Controller('polls')
export class PollsController {
  constructor(private pollsService: PollsService) {}

  @Post('create')
  createPoll(@Body() dto: CreatePollDto) {
    return this.pollsService.createPoll(dto);
  }

  @Post(':pollId/vote')
  votePoll(@Param('pollId') pollId: string, @Body() dto: VotePollDto) {
    return this.pollsService.votePoll(pollId, dto);
  }

  @Get(':pollId')
  getPoll(@Param('pollId') pollId: string) {
    return this.pollsService.getPoll(pollId);
  }

  @Get('chat/:chatId')
  getPollsForChat(@Param('chatId') chatId: string) {
    return this.pollsService.getPollsForChat(chatId);
  }

  @Delete(':pollId')
  removePoll(@Param('pollId') pollId: string) {
    return this.pollsService.removePoll(pollId);
  }
}
