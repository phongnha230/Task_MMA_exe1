import { ref, push, set, update, remove, onValue, serverTimestamp } from 'firebase/database';
import { realtimeDb } from '../config/firebase';
import { CreateTodoInput, Todo, UpdateTodoInput } from '../types/todo';
import { ITodoRepository } from './ITodoRepository';

const NODE_PATH = 'todos';

export class RealtimeTodoRepository implements ITodoRepository {
  private dbRef = ref(realtimeDb, NODE_PATH);

  subscribeTodos(onSuccess: (todos: Todo[]) => void, onError: (error: Error) => void): () => void {
    const unsubscribe = onValue(
      this.dbRef,
      (snapshot) => {
        const data = snapshot.val();
        if (!data) {
          onSuccess([]);
          return;
        }

        const todos: Todo[] = Object.keys(data).map((key) => {
          const item = data[key];
          return {
            id: key,
            title: item.title || '',
            isCompleted: !!item.isCompleted,
            priority: item.priority || 'medium',
            createdAt: typeof item.createdAt === 'number' ? item.createdAt : Date.now(),
            updatedAt: typeof item.updatedAt === 'number' ? item.updatedAt : undefined,
          };
        });

        // Sắp xếp giảm dần theo thời gian tạo
        todos.sort((a, b) => b.createdAt - a.createdAt);
        onSuccess(todos);
      },
      (err) => {
        console.error('Realtime Database subscribe error:', err);
        onError(err);
      }
    );

    return () => unsubscribe();
  }

  async addTodo(input: CreateTodoInput): Promise<Todo> {
    const newTodoRef = push(this.dbRef);
    const id = newTodoRef.key!;
    const now = Date.now();

    await set(newTodoRef, {
      title: input.title.trim(),
      isCompleted: false,
      priority: input.priority || 'medium',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return {
      id,
      title: input.title.trim(),
      isCompleted: false,
      priority: input.priority || 'medium',
      createdAt: now,
    };
  }

  async toggleTodo(id: string, currentStatus: boolean): Promise<void> {
    const itemRef = ref(realtimeDb, `${NODE_PATH}/${id}`);
    await update(itemRef, {
      isCompleted: !currentStatus,
      updatedAt: serverTimestamp(),
    });
  }

  async updateTodo(id: string, input: UpdateTodoInput): Promise<void> {
    const itemRef = ref(realtimeDb, `${NODE_PATH}/${id}`);
    const updateData: Record<string, any> = {
      updatedAt: serverTimestamp(),
    };
    if (input.title !== undefined) updateData.title = input.title.trim();
    if (input.isCompleted !== undefined) updateData.isCompleted = input.isCompleted;
    if (input.priority !== undefined) updateData.priority = input.priority;

    await update(itemRef, updateData);
  }

  async deleteTodo(id: string): Promise<void> {
    const itemRef = ref(realtimeDb, `${NODE_PATH}/${id}`);
    await remove(itemRef);
  }
}
