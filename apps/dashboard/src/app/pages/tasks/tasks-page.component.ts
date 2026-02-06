import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { hasAtLeast } from '../../auth/roles';
import { Task, TaskCategory, TaskStatus } from './task.model';
import { TasksService } from './tasks.service';

type SortKey = 'createdAt' | 'title' | 'status';

@Component({
  standalone: true,
  selector: 'app-tasks-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './tasks-page.component.html',
})
export class TasksPageComponent {
  private tasksApi = inject(TasksService);
  private auth = inject(AuthService);

  // RBAC
  canEdit = computed(() => hasAtLeast(this.auth.role(), 'ADMIN'));
  canDelete = computed(() => hasAtLeast(this.auth.role(), 'OWNER'));

  // data
  loading = signal(false);
  error = signal<string | null>(null);
  tasks = signal<Task[]>([]);

  // filters/sort
  categoryFilter = signal<TaskCategory | 'All'>('All');
  statusFilter = signal<TaskStatus | 'All'>('All');
  q = signal('');
  sortKey = signal<SortKey>('createdAt');
  sortDir = signal<'asc' | 'desc'>('desc');

  // create/edit modal
  modalOpen = signal(false);
  modalMode = signal<'create' | 'edit'>('create');
  editingId = signal<string | null>(null);

  // form
  title = signal('');
  description = signal('');
  category = signal<TaskCategory>('Work');
  status = signal<TaskStatus>('Todo');

  // ✅ delete confirm modal (IMPORTANT)
  confirmOpen = signal(false);
  taskToDelete = signal<Task | null>(null);

  filtered = computed(() => {
    const q = this.q().trim().toLowerCase();
    const cat = this.categoryFilter();
    const st = this.statusFilter();

    let items = this.tasks();

    if (cat !== 'All') items = items.filter((t) => t.category === cat);
    if (st !== 'All') items = items.filter((t) => t.status === st);

    if (q) {
      items = items.filter((t) => {
        const hay = `${t.title} ${t.description ?? ''}`.toLowerCase();
        return hay.includes(q);
      });
    }

    const key = this.sortKey();
    const dir = this.sortDir();

    items = [...items].sort((a, b) => {
      const av = a[key] ?? '';
      const bv = b[key] ?? '';
      const cmp =
        key === 'createdAt'
          ? new Date(av as string).getTime() - new Date(bv as string).getTime()
          : String(av).localeCompare(String(bv));
      return dir === 'asc' ? cmp : -cmp;
    });

    return items;
  });

  constructor() {
    effect(() => {
      this.load();
    });
  }

  load() {
    this.loading.set(true);
    this.error.set(null);

    this.tasksApi.list().subscribe({
      next: (rows) => {
        this.tasks.set(rows ?? []);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(e?.error?.message ?? 'Failed to load tasks');
        this.loading.set(false);
      },
    });
  }

  toggleSort(key: SortKey) {
    if (this.sortKey() === key) {
      this.sortDir.set(this.sortDir() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortKey.set(key);
      this.sortDir.set('asc');
    }
  }

  // ---------- Create/Edit ----------
  openCreate() {
    if (!this.canEdit()) return;

    this.modalMode.set('create');
    this.editingId.set(null);

    this.title.set('');
    this.description.set('');
    this.category.set('Work');
    this.status.set('Todo');

    this.modalOpen.set(true);
  }

  openEdit(t: Task) {
    if (!this.canEdit()) return;

    this.modalMode.set('edit');
    this.editingId.set(t.id);

    this.title.set(t.title);
    this.description.set(t.description ?? '');
    this.category.set(t.category);
    this.status.set(t.status);

    this.modalOpen.set(true);
  }

  closeModal() {
    this.modalOpen.set(false);
  }

  save() {
    if (!this.canEdit()) return;

    const payload = {
      title: this.title().trim(),
      description: this.description().trim() || undefined,
      category: this.category(),
      status: this.status(),
    };

    if (!payload.title) {
      this.error.set('Title is required');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    if (this.modalMode() === 'create') {
      this.tasksApi.create(payload).subscribe({
        next: () => {
          this.modalOpen.set(false);
          this.load();
        },
        error: (e) => {
          this.error.set(e?.error?.message ?? 'Create failed');
          this.loading.set(false);
        },
      });
      return;
    }

    const id = this.editingId();
    if (!id) return;

    this.tasksApi.update(id, payload).subscribe({
      next: () => {
        this.modalOpen.set(false);
        this.load();
      },
      error: (e) => {
        this.error.set(e?.error?.message ?? 'Update failed');
        this.loading.set(false);
      },
    });
  }

  // ---------- Delete (Owner only) ----------
  askDelete(t: Task) {
    if (!this.canDelete()) return;
    this.taskToDelete.set(t);
    this.confirmOpen.set(true);
  }

  cancelDelete() {
    this.taskToDelete.set(null);
    this.confirmOpen.set(false);
  }

  confirmDelete() {
    if (!this.canDelete()) return;

    const t = this.taskToDelete();
    if (!t) return;

    this.loading.set(true);
    this.error.set(null);

    this.tasksApi.remove(t.id).subscribe({
      next: () => {
        this.confirmOpen.set(false);
        this.taskToDelete.set(null);
        this.load();
      },
      error: (e) => {
        this.error.set(e?.error?.message ?? 'Delete failed');
        this.loading.set(false);
      },
    });
  }

  // ---------- UI helpers ----------
  badgeClass(status: TaskStatus) {
    switch (status) {
      case 'Todo':
        return 'bg-gray-100 text-gray-700';
      case 'InProgress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Done':
        return 'bg-green-100 text-green-800';
    }
  }
}
