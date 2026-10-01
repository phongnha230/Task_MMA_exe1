import { CreateTodoInput, Todo, UpdateTodoInput } from '../types/todo';

export interface ITodoRepository {
  /**
   * Lắng nghe dữ liệu theo thời gian thực (Real-time listener)
   * Trả về hàm unsubscribe để hủy lắng nghe khi unmount.
   */
  subscribeTodos(onSuccess: (todos: Todo[]) => void, onError: (error: Error) => void): () => void;

  /**
   * Thêm một công việc mới
   */
  addTodo(input: CreateTodoInput): Promise<Todo>;

  /**
   * Chuyển đổi trạng thái hoàn thành (Toggle complete)
   */
  toggleTodo(id: string, currentStatus: boolean): Promise<void>;

  /**
   * Cập nhật thông tin công việc
   */
  updateTodo(id: string, input: UpdateTodoInput): Promise<void>;

  /**
   * Xóa công việc
   */
  deleteTodo(id: string): Promise<void>;
}
