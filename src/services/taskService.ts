import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { firestore } from '../config/firebase';
import { CreateTaskInput, Task, UpdateTaskInput } from '../types/task';

export const TASKS_COLLECTION = 'tasks';

class TaskService {
  private collectionRef = collection(firestore, TASKS_COLLECTION);

  /**
   * Real-time subscription to all tasks (or filtered)
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
            teamName: data.teamName || null,
            assigneeId: data.assigneeId || null,
            assigneeName: data.assigneeName || null,
            createdById: data.createdById || null,
            createdByName: data.createdByName || null,
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
   * Real-time subscription to tasks belonging to a specific team
   */
  subscribeTeamTasks(
    teamId: string,
    onSuccess: (tasks: Task[]) => void,
    onError: (error: Error) => void
  ): () => void {
    const q = query(this.collectionRef, where('teamId', '==', teamId));

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
            teamName: data.teamName || null,
            assigneeId: data.assigneeId || null,
            assigneeName: data.assigneeName || null,
            createdById: data.createdById || null,
            createdByName: data.createdByName || null,
          };
        });

        // Sắp xếp theo ngày tạo mới nhất lên đầu
        tasks.sort((a, b) => b.createdAt - a.createdAt);
        onSuccess(tasks);
      },
      (err) => {
        console.error('Firestore subscribe team tasks error:', err);
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
      teamName: input.teamName || null,
      assigneeId: input.assigneeId || null,
      assigneeName: input.assigneeName || null,
      createdById: input.createdById || null,
      createdByName: input.createdByName || null,
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
    if (input.teamName !== undefined) updateData.teamName = input.teamName;
    if (input.assigneeId !== undefined) updateData.assigneeId = input.assigneeId;
    if (input.assigneeName !== undefined) updateData.assigneeName = input.assigneeName;

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
