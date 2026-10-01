import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  CreateTodoInput,
  FilterStatus,
  Priority,
  Todo,
  TodoStats,
  UpdateTodoInput,
} from '../types/todo';
import { TodoService } from '../services/todoService';
import { FirestoreTodoRepository } from '../repositories/FirestoreTodoRepository';
// Gợi ý: Nếu muốn chuyển sang Realtime Database, chỉ cần thay bằng:
// import { RealtimeTodoRepository } from '../repositories/RealtimeTodoRepository';

// Khởi tạo Repository & Service (Dependency Injection)
const todoRepository = new FirestoreTodoRepository();
// const todoRepository = new RealtimeTodoRepository();
const todoService = new TodoService(todoRepository);

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Lắng nghe dữ liệu thời gian thực từ Firebase
  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsubscribe = todoService.subscribeTodos(
      (data) => {
        setTodos(data);
        setLoading(false);
      },
      (err) => {
        setError(err.message || 'Lỗi khi tải dữ liệu');
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // Action: Thêm todo
  const addTodo = useCallback(async (title: string, priority: Priority = 'medium') => {
    try {
      setError(null);
      await todoService.addTodo({ title, priority });
    } catch (err: any) {
      setError(err.message || 'Lỗi khi thêm công việc');
      throw err;
    }
  }, []);

  // Action: Đổi trạng thái hoàn thành
  const toggleTodo = useCallback(async (id: string, currentStatus: boolean) => {
    try {
      setError(null);
      await todoService.toggleTodo(id, currentStatus);
    } catch (err: any) {
      setError(err.message || 'Lỗi khi cập nhật trạng thái');
      throw err;
    }
  }, []);

  // Action: Chỉnh sửa
  const updateTodo = useCallback(async (id: string, input: UpdateTodoInput) => {
    try {
      setError(null);
      await todoService.updateTodo(id, input);
    } catch (err: any) {
      setError(err.message || 'Lỗi khi sửa công việc');
      throw err;
    }
  }, []);

  // Action: Xóa
  const deleteTodo = useCallback(async (id: string) => {
    try {
      setError(null);
      await todoService.deleteTodo(id);
    } catch (err: any) {
      setError(err.message || 'Lỗi khi xóa công việc');
      throw err;
    }
  }, []);

  // Danh sách công việc sau khi áp dụng Filter & Search
  const filteredTodos = useMemo(() => {
    return todos.filter((item) => {
      // Lọc trạng thái
      if (filter === 'active' && item.isCompleted) return false;
      if (filter === 'completed' && !item.isCompleted) return false;

      // Lọc từ khóa tìm kiếm
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return item.title.toLowerCase().includes(query);
      }
      return true;
    });
  }, [todos, filter, searchQuery]);

  // Thống kê nhanh
  const stats: TodoStats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((t) => t.isCompleted).length;
    return {
      total,
      completed,
      active: total - completed,
    };
  }, [todos]);

  return {
    todos: filteredTodos,
    allTodosCount: todos.length,
    loading,
    error,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    stats,
    addTodo,
    toggleTodo,
    updateTodo,
    deleteTodo,
  };
}
