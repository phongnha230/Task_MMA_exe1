import { doc, getDoc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { firestore } from '../config/firebase';
import { UserProfile } from '../types/user';

export const USERS_COLLECTION = 'users';

class UserService {
  async createUserProfile(
    uid: string,
    name: string,
    email: string,
    avatarUrl: string | null = null
  ): Promise<UserProfile> {
    const userRef = doc(firestore, USERS_COLLECTION, uid);
    const existingSnap = await getDoc(userRef);

    if (existingSnap.exists()) {
      const data = existingSnap.data();
      return {
        id: existingSnap.id,
        name: data.name || name,
        email: data.email || email,
        avatarUrl: data.avatarUrl || avatarUrl,
        createdAt:
          data.createdAt instanceof Timestamp
            ? data.createdAt.toMillis()
            : typeof data.createdAt === 'number'
              ? data.createdAt
              : Date.now(),
      };
    }

    const newProfileData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      avatarUrl,
      createdAt: serverTimestamp(),
    };

    await setDoc(userRef, newProfileData);

    return {
      id: uid,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      avatarUrl,
      createdAt: Date.now(),
    };
  }

  async getUserProfile(uid: string): Promise<UserProfile | null> {
    const userRef = doc(firestore, USERS_COLLECTION, uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) return null;

    const data = snap.data();
    return {
      id: snap.id,
      name: data.name || '',
      email: data.email || '',
      avatarUrl: data.avatarUrl || null,
      createdAt:
        data.createdAt instanceof Timestamp
          ? data.createdAt.toMillis()
          : typeof data.createdAt === 'number'
            ? data.createdAt
            : Date.now(),
    };
  }
}

export const userService = new UserService();
