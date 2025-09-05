import { Controller, Post, Body, Param, Patch, Delete, Get } from '@nestjs/common';
import { CallsService } from './calls.service';
import { CallType } from './enum';

@Controller('calls')
export class CallsController {
  constructor(private callsService: CallsService) {}

  @Post('start')
  startCall(@Body() body: { chatId: string; initiatorId: string; type: CallType }) {
    return this.callsService.startCall(body.chatId, body.initiatorId, body.type);
  }

  @Post(':callId/join')
  joinCall(@Param('callId') callId: string, @Body() body: { userId: string }) {
    return this.callsService.joinCall(callId, body.userId);
  }

  @Patch(':callId/end')
  endCall(@Param('callId') callId: string, @Body() body: { userId: string }) {
    return this.callsService.endCall(callId, body.userId);
  }

  @Delete(':callId/leave')
  leaveCall(@Param('callId') callId: string, @Body() body: { userId: string }) {
    return this.callsService.leaveCall(callId, body.userId);
  }

  @Get('chat/:chatId')
  getCallsForChat(@Param('chatId') chatId: string) {
    return this.callsService.getCallsForChat(chatId);
  }
}
