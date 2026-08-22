import { IsNumber, IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class CreateTaskDto {
// key is require by Dataase.
  @IsString()
  @IsNotEmpty()
  key: string;

// name is required by Database.
  @IsString()
  @IsNotEmpty()
  name: string;

// note is optional.
  @IsOptional()
  @IsString()
  note?: string;

  // this is 'points' DB calls it exp. Required by Database.
  @IsNumber()
  exp: number;

  // this is 'type' DB calls it taskType. checkbox.
  @IsString()
  @IsNotEmpty()
  taskType: string;

  // this is 'targetValue' DB calls it targetValue. optional.
  @IsOptional()
  @IsNumber()
  targetValue?: number;
}