import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksService } from '../pages/tasks/tasks.service';
import { Task } from '../pages/tasks/task.model';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private readonly tasksService = inject(TasksService);

  loading = signal(true);
  errorMsg = signal<string | null>(null);
  tasks = signal<Task[]>([]);

  hasTasks = computed(() => this.tasks().length > 0);

  ngOnInit(): void {
    this.reload();
  }

  reload() {
    this.loading.set(true);
    this.errorMsg.set(null);
    this.tasks.set([]);

    this.tasksService.list().subscribe({
      next: (res: Task[]) => {
        this.tasks.set(res ?? []);
        this.loading.set(false);
      },
      error: (err: any) => {
        this.loading.set(false);
        this.errorMsg.set(
          err?.error?.message || err?.message || 'Failed to load tasks'
        );
      },
    });
  }

  statusClass(status: Task['status']) {
    switch (status) {
      case 'Todo':
        return 'bg-slate-100 text-slate-700';
      case 'InProgress':
        return 'bg-blue-100 text-blue-700';
      case 'Done':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  }
}
