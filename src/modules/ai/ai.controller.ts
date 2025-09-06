// import { Controller, Post, Body } from '@nestjs/common';
// import { AiService } from './ai.service';

// @Controller('ai')
// export class AiController {
//   constructor(private readonly aiService: AiService) {}

//   @Post('ask')
//   async ask(@Body('question') question: string) {
//     const answer = await this.aiService.askQuestion(question);
//     return { question, answer };
//   }
// }

// src/modules/ai/ai.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('ask')
  async ask(@Body() body: { question: string }) {
    const answer = await this.aiService.askQuestion(body.question);
    return { question: body.question, answer };
  }
}
