import { IsString, IsNotEmpty, IsArray, ArrayMinSize, IsOptional, IsDateString } from 'class-validator';

export class CreatePollDto {
  @IsString()
  @IsNotEmpty()
  chatId: string;

  @IsString()
  @IsNotEmpty()
  creatorId: string;

  @IsString()
  @IsNotEmpty()
  question: string;

  @IsArray()
  @ArrayMinSize(2)
  options: string[];

  @IsOptional()
  @IsDateString()
  endsAt?: string;
}
