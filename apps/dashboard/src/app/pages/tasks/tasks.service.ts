import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task, TaskCategory, TaskStatus } from './task.model';

type CreateTaskDto = {
  title: string;
  description?: string;
  category: TaskCategory;
  status: TaskStatus;
};

type UpdateTaskDto = Partial<CreateTaskDto>;

@Injectable({ providedIn: 'root' })
export class TasksService {
  private http = inject(HttpClient);

  list() {
    return this.http.get<Task[]>('/api/tasks');
  }

  create(dto: CreateTaskDto) {
    return this.http.post<Task>('/api/tasks', dto);
  }

  update(id: string, dto: UpdateTaskDto) {
    return this.http.patch<Task>(`/api/tasks/${id}`, dto);
  }

  remove(id: string) {
    return this.http.delete<{ ok: true }>(`/api/tasks/${id}`);
  }
}
