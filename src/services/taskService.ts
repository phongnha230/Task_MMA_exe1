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
import { firestore } from './firebase';
import { CreateTaskInput, Task, UpdateTaskInput } from '../types/task';

export const TASKS_COLLECTION = 'tasks';

class TaskService {
  private collectionRef = collection(firestore, TASKS_COLLECTION);

  /**
   * Real-time subscription to tasks collection
   */
  subscribeTasks(onSuccess: (tasks: Task[]) => void, onError: (error: Error) => void): () => void {
    const q = query(this.collectionRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const tasks: Task[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();

          const createdAt =
            data.createdAt instanceof Timestamp
              ? data.createdAt.toMillis()
              : typeof data.createdAt === 'number'
                ? data.createdAt
                : Date.now();

          const updatedAt =
            data.updatedAt instanceof Timestamp
              ? data.updatedAt.toMillis()
              : typeof data.updatedAt === 'number'
                ? data.updatedAt
                : undefined;

          return {
            id: docSnap.id,
            title: data.title || '',
            description: data.description || '',
            status: data.status || 'To Do',
            priority: data.priority || 'Medium',
            dueDate: data.dueDate || null,
            createdAt,
            updatedAt,
            teamId: data.teamId || null,
            assigneeId: data.assigneeId || null,
          };
        });
        onSuccess(tasks);
      },
      (err) => {
        console.error('Firestore subscribe tasks error:', err);
        onError(err);
      }
    );

    return unsubscribe;
  }

  /**
   * Create a new task in Firestore
   */
  async createTask(input: CreateTaskInput): Promise<string> {
    const docRef = await addDoc(this.collectionRef, {
      title: input.title.trim(),
      description: input.description?.trim() || '',
      status: input.status || 'To Do',
      priority: input.priority || 'Medium',
      dueDate: input.dueDate || null,
      teamId: input.teamId || null,
      assigneeId: input.assigneeId || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  }

  /**
   * Update an existing task
   */
  async updateTask(id: string, input: UpdateTaskInput): Promise<void> {
    const docRef = doc(firestore, TASKS_COLLECTION, id);
    const updateData: Record<string, unknown> = {
      updatedAt: serverTimestamp(),
    };

    if (input.title !== undefined) updateData.title = input.title.trim();
    if (input.description !== undefined) updateData.description = input.description.trim();
    if (input.status !== undefined) updateData.status = input.status;
    if (input.priority !== undefined) updateData.priority = input.priority;
    if (input.dueDate !== undefined) updateData.dueDate = input.dueDate;
    if (input.teamId !== undefined) updateData.teamId = input.teamId;
    if (input.assigneeId !== undefined) updateData.assigneeId = input.assigneeId;

    await updateDoc(docRef, updateData);
  }

  /**
   * Delete a task
   */
  async deleteTask(id: string): Promise<void> {
    const docRef = doc(firestore, TASKS_COLLECTION, id);
    await deleteDoc(docRef);
  }
}

export const taskService = new TaskService();
