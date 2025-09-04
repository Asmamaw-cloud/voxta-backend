import { IsString } from 'class-validator';

export class ReactMessageDto {
  @IsString()
  type: string; // like 'like', 'love', 'laugh'
}
