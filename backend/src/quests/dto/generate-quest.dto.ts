import { IsString, IsNotEmpty } from 'class-validator';

export class GenerateQuestDto{
  @IsString()
  @IsNotEmpty()
  goal: string;
}
