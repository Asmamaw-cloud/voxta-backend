import { IsString, IsOptional, IsEnum, IsArray } from 'class-validator';
import { MessageType } from '../enums';

export class CreateMessageDto {
  @IsString()
  chatId: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsEnum(MessageType)
  @IsOptional()
  type?: MessageType;

  @IsArray()
  @IsOptional()
  attachments?: string[];

  @IsString()
  @IsOptional()
  parentId?: string; // for replies
}
