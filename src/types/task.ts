export type TaskStatus = 'To Do' | 'In Progress' | 'Done';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null; // ISO string format (e.g. YYYY-MM-DD) or empty
  createdAt: number; // Milliseconds timestamp
  updatedAt?: number;
  teamId: string | null;
  teamName?: string | null;
  assigneeId: string | null;
  assigneeName?: string | null;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string | null;
  teamId?: string | null;
  teamName?: string | null;
  assigneeId?: string | null;
  assigneeName?: string | null;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string | null;
  teamId?: string | null;
  teamName?: string | null;
  assigneeId?: string | null;
  assigneeName?: string | null;
}

export interface TaskStats {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
}
