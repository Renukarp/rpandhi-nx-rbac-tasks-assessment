import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { randomUUID } from 'crypto';

export type TaskStatus = 'Todo' | 'InProgress' | 'Done';
export type TaskCategory = 'Work' | 'Personal';

export type TaskEntity = {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
};

@Injectable()
export class TasksService {
  private tasks: TaskEntity[] = [
    {
      id: randomUUID(),
      title: 'Initial Task (Work)',
      description: 'Seed task for UI',
      category: 'Work',
      status: 'Todo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: randomUUID(),
      title: 'Another Task (Personal)',
      description: 'Second seed task',
      category: 'Personal',
      status: 'InProgress',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  list(): TaskEntity[] {
    return this.tasks;
  }

  create(dto: CreateTaskDto): TaskEntity {
    const now = new Date().toISOString();
    const t: TaskEntity = {
      id: randomUUID(),
      title: dto.title,
      description: dto.description,
      category: dto.category,
      status: dto.status,
      createdAt: now,
      updatedAt: now,
    };
    this.tasks = [t, ...this.tasks];
    return t;
  }

  update(id: string, dto: UpdateTaskDto): TaskEntity {
    const idx = this.tasks.findIndex((t) => t.id === id);
    if (idx === -1) throw new NotFoundException('Task not found');

    const now = new Date().toISOString();
    const current = this.tasks[idx];
    const updated: TaskEntity = {
      ...current,
      ...dto,
      updatedAt: now,
    };

    const copy = [...this.tasks];
    copy[idx] = updated;
    this.tasks = copy;
    return updated;
  }

  remove(id: string): { ok: true } {
    const before = this.tasks.length;
    this.tasks = this.tasks.filter((t) => t.id !== id);
    if (this.tasks.length === before)
      throw new NotFoundException('Task not found');
    return { ok: true };
  }
}
