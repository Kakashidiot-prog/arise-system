import { IsString, IsInt, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateTaskDto } from './create-task.dto';

export class CreateQuestDto {
  @IsString()
  key: string;

  @IsString()
  name: string;

  @IsString()
  icon: string;

  @IsString()
  sub: string;

  @IsString()
  category: string;

  @IsInt()
  order: number;

  @IsOptional()
  isDaily?: boolean;

  // Uses the same validation as CreateTaskDto for the tasks array.  "Single Source of Truth"
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTaskDto)
  tasks?: CreateTaskDto[];
}