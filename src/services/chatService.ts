import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { firestore } from '../config/firebase';
import { ChatMessage } from '../types/chat';
import { UserProfile } from '../types/user';

class ChatService {
  subscribeMessages(
    teamId: string,
    onSuccess: (messages: ChatMessage[]) => void,
    onError: (err: Error) => void
  ): () => void {
    const messagesRef = collection(firestore, 'teams', teamId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const messages: ChatMessage[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            senderId: data.senderId,
            senderName: data.senderName || 'Ẩn danh',
            senderEmail: data.senderEmail || '',
            text: data.text || '',
            createdAt:
              data.createdAt instanceof Timestamp
                ? data.createdAt.toMillis()
                : typeof data.createdAt === 'number'
                  ? data.createdAt
                  : Date.now(),
          };
        });
        onSuccess(messages);
      },
      (err) => {
        console.error('Error subscribing team messages:', err);
        onError(err);
      }
    );

    return unsubscribe;
  }

  async sendMessage(teamId: string, user: UserProfile, text: string): Promise<string> {
    const trimmed = text.trim();
    if (!trimmed) throw new Error('Tin nhắn không được để trống.');

    const messagesRef = collection(firestore, 'teams', teamId, 'messages');
    const docRef = await addDoc(messagesRef, {
      senderId: user.id,
      senderName: user.name,
      senderEmail: user.email,
      text: trimmed,
      createdAt: serverTimestamp(),
    });

    return docRef.id;
  }
}

export const chatService = new ChatService();
