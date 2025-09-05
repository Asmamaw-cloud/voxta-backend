// src/modules/tasks/dto/create-task.dto.ts
import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { TaskStatus } from '../enum';

export class CreateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  assignedToId?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsString()
  messageId?: string; // <-- Add this to allow message-linked creation
}
