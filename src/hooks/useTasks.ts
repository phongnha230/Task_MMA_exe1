import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { CreateTaskInput, Task, TaskStats, TaskStatus, UpdateTaskInput } from '../types/task';
import { taskService } from '../services/taskService';

export type StatusFilter = 'All' | TaskStatus;
export type ScopeFilter = 'all' | 'my';

export const useTasks = (currentUserId?: string | null) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [scopeFilter, setScopeFilter] = useState<ScopeFilter>('all');
  const [refreshing, setRefreshing] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

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

  // Filter tasks based on scope (Tất cả vs Việc của tôi: được gán HOẶC do mình tạo)
  const scopedTasks = useMemo(() => {
    if (scopeFilter === 'all' || !currentUserId) return tasks;
    return tasks.filter(
      (t) => t.assigneeId === currentUserId || t.createdById === currentUserId
    );
  }, [tasks, scopeFilter, currentUserId]);

  const filteredTasks = useMemo(() => {
    if (statusFilter === 'All') return scopedTasks;
    return scopedTasks.filter((t) => t.status === statusFilter);
  }, [scopedTasks, statusFilter]);

  // Single-pass O(N) statistics aggregation based on scoped tasks
  const stats: TaskStats = useMemo(() => {
    let todo = 0;
    let inProgress = 0;
    let done = 0;

    for (let i = 0; i < scopedTasks.length; i++) {
      const s = scopedTasks[i].status;
      if (s === 'To Do') todo++;
      else if (s === 'In Progress') inProgress++;
      else if (s === 'Done') done++;
    }

    return {
      total: scopedTasks.length,
      todo,
      inProgress,
      done,
    };
  }, [scopedTasks]);

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
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
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
    scopeFilter,
    setScopeFilter,
    stats,
    createTask,
    updateTask,
    deleteTask,
    handleRefresh,
  };
};
