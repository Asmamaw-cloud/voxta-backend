import { Controller, Post, Body, Get, Param, UseGuards, Req, Delete } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { ReactMessageDto } from './dto/react-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Post()
  createMessage(@Req() req: any, @Body() dto: CreateMessageDto) {
    return this.messagesService.createMessage(req.user.userId, dto);
  }

  @Get('chat/:chatId')
  getChatMessages(@Param('chatId') chatId: string) {
    return this.messagesService.getChatMessages(chatId);
  }

  @Get(':id')
  getMessageById(@Param('id') id: string) {
    return this.messagesService.getMessageById(id);
  }

  @Post(':id/react')
  addReaction(@Req() req: any, @Param('id') messageId: string, @Body() dto: ReactMessageDto) {
    return this.messagesService.addReaction(req.user.userId, messageId, dto.type);
  }

  @Delete(':id/react')
removeReaction(@Req() req: any, @Param('id') messageId: string) {
  return this.messagesService.removeReaction(req.user.userId, messageId);
}
}
