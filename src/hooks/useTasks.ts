import { useState, useEffect, useMemo, useCallback } from 'react';
import { CreateTaskInput, Task, TaskStats, TaskStatus, UpdateTaskInput } from '../types/task';
import { taskService } from '../services/taskService';

export type StatusFilter = 'All' | TaskStatus;

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = taskService.subscribeTasks(
      (data) => {
        setTasks(data);
        setLoading(false);
        setError(null);
        setRefreshing(false);
      },
      (err) => {
        setError(err.message || 'Không thể tải danh sách công việc');
        setLoading(false);
        setRefreshing(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const filteredTasks = useMemo(() => {
    if (statusFilter === 'All') return tasks;
    return tasks.filter((t) => t.status === statusFilter);
  }, [tasks, statusFilter]);

  const stats: TaskStats = useMemo(() => {
    return {
      total: tasks.length,
      todo: tasks.filter((t) => t.status === 'To Do').length,
      inProgress: tasks.filter((t) => t.status === 'In Progress').length,
      done: tasks.filter((t) => t.status === 'Done').length,
    };
  }, [tasks]);

  const createTask = useCallback(async (input: CreateTaskInput) => {
    return await taskService.createTask(input);
  }, []);

  const updateTask = useCallback(async (id: string, input: UpdateTaskInput) => {
    return await taskService.updateTask(id, input);
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    return await taskService.deleteTask(id);
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    // Realtime listener handles continuous sync, this resets visual indicator
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  }, []);

  return {
    tasks: filteredTasks,
    allTasks: tasks,
    loading,
    error,
    refreshing,
    statusFilter,
    setStatusFilter,
    stats,
    createTask,
    updateTask,
    deleteTask,
    handleRefresh,
  };
};
