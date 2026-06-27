import { IsString, IsInt, IsArray, IsOptional, ValidateNested, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTaskDto {
  @IsString()
  key: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsNumber()
  @Min(0)
  exp: number;
}

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
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTaskDto)
  tasks?: CreateTaskDto[];
}
