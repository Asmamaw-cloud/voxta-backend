import { IsString, IsNotEmpty } from 'class-validator';

export class VotePollDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  option: string;
}
