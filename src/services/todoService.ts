import { ITodoRepository } from '../repositories/ITodoRepository';
import { CreateTodoInput, Todo, UpdateTodoInput } from '../types/todo';

/**
 * Service Layer: Chứa các quy tắc nghiệp vụ (Business Rules / Validation)
 * Độc lập với UI và không phụ thuộc trực tiếp vào Firebase SDK cụ thể.
 */
export class TodoService {
  constructor(private repository: ITodoRepository) {}

  subscribeTodos(onSuccess: (todos: Todo[]) => void, onError: (error: Error) => void): () => void {
    return this.repository.subscribeTodos(onSuccess, onError);
  }

  async addTodo(input: CreateTodoInput): Promise<Todo> {
    const cleanTitle = input.title?.trim();
    if (!cleanTitle) {
      throw new Error('Tiêu đề công việc không được để trống.');
    }
    if (cleanTitle.length > 150) {
      throw new Error('Tiêu đề không được vượt quá 150 ký tự.');
    }

    return this.repository.addTodo({
      ...input,
      title: cleanTitle,
    });
  }

  async toggleTodo(id: string, currentStatus: boolean): Promise<void> {
    if (!id) throw new Error('ID công việc không hợp lệ.');
    return this.repository.toggleTodo(id, currentStatus);
  }

  async updateTodo(id: string, input: UpdateTodoInput): Promise<void> {
    if (!id) throw new Error('ID công việc không hợp lệ.');
    if (input.title !== undefined && !input.title.trim()) {
      throw new Error('Tiêu đề không thể sửa thành rỗng.');
    }
    return this.repository.updateTodo(id, input);
  }

  async deleteTodo(id: string): Promise<void> {
    if (!id) throw new Error('ID công việc không hợp lệ.');
    return this.repository.deleteTodo(id);
  }
}
