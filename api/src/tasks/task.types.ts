export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskCategory = 'work' | 'personal';

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}
