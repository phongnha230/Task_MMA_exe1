export type Priority = 'low' | 'medium' | 'high';

export type FilterStatus = 'all' | 'active' | 'completed';

export interface Todo {
  id: string;
  title: string;
  isCompleted: boolean;
  priority: Priority;
  createdAt: number; // Timestamp (milliseconds)
  updatedAt?: number;
}

export interface CreateTodoInput {
  title: string;
  priority?: Priority;
}

export interface UpdateTodoInput {
  title?: string;
  isCompleted?: boolean;
  priority?: Priority;
}

export interface TodoStats {
  total: number;
  completed: number;
  active: number;
}
