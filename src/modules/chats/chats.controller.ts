import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateChatDto } from './dto/create-chat.dto';
import { AddMemberDto } from './dto/add-member.dto';

@Controller('chats')
@UseGuards(AuthGuard('jwt'))
export class ChatsController {
  constructor(private chatsService: ChatsService) {}

  @Post()
  createChat(@Body() dto: CreateChatDto, @Req() req: any) {
    return this.chatsService.createChat(dto.name, dto.type, req.user.userId, dto.memberIds);
  }

  @Post(':chatId/members')
  addMember(@Param('chatId') chatId: string, @Body() dto: AddMemberDto) {
    return this.chatsService.addMember(chatId, dto.userId, dto.role);
  }

  @Delete(':chatId/members/:userId')
  removeMember(@Param('chatId') chatId: string, @Param('userId') userId: string) {
    return this.chatsService.removeMember(chatId, userId);
  }

  @Get(':chatId')
  getChat(@Param('chatId') chatId: string) {
    return this.chatsService.getChatById(chatId);
  }

  @Get('me')
  getUserChats(@Req() req: any) {
    return this.chatsService.getUserChats(req.user.userId);
  }
}
