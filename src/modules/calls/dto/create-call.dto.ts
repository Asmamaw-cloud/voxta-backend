import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CallType } from '../enum';

export class CreateCallDto {
  @IsNotEmpty()
  @IsString()
  chatId: string;

  @IsNotEmpty()
  @IsEnum(CallType)
  type: CallType;

  @IsOptional()
  @IsString({ each: true })
  participantIds?: string[]; // users to add initially
}
