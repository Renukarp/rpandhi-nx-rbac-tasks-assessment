import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class TasksController {
  constructor(private readonly tasks: TasksService) {}

  // Viewer/Admin/Owner
  @Get()
  @Roles('VIEWER')
  list() {
    return this.tasks.list();
  }

  // Admin/Owner
  @Post()
  @Roles('ADMIN')
  create(@Body() dto: CreateTaskDto) {
    return this.tasks.create(dto);
  }

  // Admin/Owner
  @Patch(':id')
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.tasks.update(id, dto);
  }

  // Owner only
  @Delete(':id')
  @Roles('OWNER')
  remove(@Param('id') id: string) {
    return this.tasks.remove(id);
  }
}
