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
  teamId: string | null; // For Practical Exam 2
  assigneeId: string | null; // For Practical Exam 2
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string | null;
  teamId?: string | null;
  assigneeId?: string | null;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string | null;
  teamId?: string | null;
  assigneeId?: string | null;
}

export interface TaskStats {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
}
