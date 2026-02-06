export type TaskStatus = 'Todo' | 'InProgress' | 'Done';
export type TaskCategory = 'Work' | 'Personal';

export type Task = {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
};
