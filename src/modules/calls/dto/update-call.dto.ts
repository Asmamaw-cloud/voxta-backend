import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CallStatus } from '../enum';

export class UpdateCallDto {
  @IsOptional()
  @IsEnum(CallStatus)
  status?: CallStatus;

  @IsOptional()
  @IsString({ each: true })
  addParticipants?: string[];

  @IsOptional()
  @IsString({ each: true })
  removeParticipants?: string[];
}
