import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { firestore } from '../config/firebase';
import { CreateTodoInput, Todo, UpdateTodoInput } from '../types/todo';
import { ITodoRepository } from './ITodoRepository';

const COLLECTION_NAME = 'todos';

export class FirestoreTodoRepository implements ITodoRepository {
  private todosRef = collection(firestore, COLLECTION_NAME);

  subscribeTodos(onSuccess: (todos: Todo[]) => void, onError: (error: Error) => void): () => void {
    // Sắp xếp theo thời gian tạo mới nhất lên đầu
    const q = query(this.todosRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const todos: Todo[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          const createdAt =
            data.createdAt instanceof Timestamp
              ? data.createdAt.toMillis()
              : typeof data.createdAt === 'number'
                ? data.createdAt
                : Date.now();

          return {
            id: docSnap.id,
            title: data.title || '',
            isCompleted: !!data.isCompleted,
            priority: data.priority || 'medium',
            createdAt,
            updatedAt: data.updatedAt ? data.updatedAt.toMillis?.() || data.updatedAt : undefined,
          };
        });
        onSuccess(todos);
      },
      (err) => {
        console.error('Firestore subscribe error:', err);
        onError(err);
      }
    );

    return unsubscribe;
  }

  async addTodo(input: CreateTodoInput): Promise<Todo> {
    const docRef = await addDoc(this.todosRef, {
      title: input.title.trim(),
      isCompleted: false,
      priority: input.priority || 'medium',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return {
      id: docRef.id,
      title: input.title.trim(),
      isCompleted: false,
      priority: input.priority || 'medium',
      createdAt: Date.now(),
    };
  }

  async toggleTodo(id: string, currentStatus: boolean): Promise<void> {
    const docRef = doc(firestore, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      isCompleted: !currentStatus,
      updatedAt: serverTimestamp(),
    });
  }

  async updateTodo(id: string, input: UpdateTodoInput): Promise<void> {
    const docRef = doc(firestore, COLLECTION_NAME, id);
    const updateData: Record<string, any> = {
      updatedAt: serverTimestamp(),
    };
    if (input.title !== undefined) updateData.title = input.title.trim();
    if (input.isCompleted !== undefined) updateData.isCompleted = input.isCompleted;
    if (input.priority !== undefined) updateData.priority = input.priority;

    await updateDoc(docRef, updateData);
  }

  async deleteTodo(id: string): Promise<void> {
    const docRef = doc(firestore, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  }
}
