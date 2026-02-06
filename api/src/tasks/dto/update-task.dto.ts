import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(['Work', 'Personal'])
  category?: 'Work' | 'Personal';

  @IsOptional()
  @IsIn(['Todo', 'InProgress', 'Done'])
  status?: 'Todo' | 'InProgress' | 'Done';
}
