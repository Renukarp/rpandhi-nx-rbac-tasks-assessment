import { IsIn, IsOptional, IsString, Length } from 'class-validator';
import type { TaskCategory, TaskStatus } from './task.types';

export class CreateTaskDto {
  @IsString()
  @Length(1, 120)
  title!: string;

  @IsOptional()
  @IsString()
  @Length(0, 1000)
  description?: string;

  @IsIn(['work', 'personal'])
  category!: TaskCategory;

  @IsIn(['todo', 'in_progress', 'done'])
  status!: TaskStatus;
}

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @Length(1, 120)
  title?: string;

  @IsOptional()
  @IsString()
  @Length(0, 1000)
  description?: string;

  @IsOptional()
  @IsIn(['work', 'personal'])
  category?: TaskCategory;

  @IsOptional()
  @IsIn(['todo', 'in_progress', 'done'])
  status?: TaskStatus;
}
