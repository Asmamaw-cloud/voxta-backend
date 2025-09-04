import { IsEnum, IsString } from 'class-validator';
import { ChatRole } from '../enums';

export class AddMemberDto {
  @IsString()
  userId: string;

  @IsEnum(ChatRole)
  role?: ChatRole = ChatRole.MEMBER;
}
