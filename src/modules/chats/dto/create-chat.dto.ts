import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { ChatType } from '../enums';

export class CreateChatDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsEnum(ChatType)
  type: ChatType;

  @IsArray()
  @IsString({ each: true })
  memberIds: string[];
}
