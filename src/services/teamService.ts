import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { firestore } from '../config/firebase';
import { CreateTeamInput, Team, TeamMember } from '../types/team';
import { UserProfile } from '../types/user';

export const TEAMS_COLLECTION = 'teams';
export const TEAM_MEMBERS_COLLECTION = 'teamMembers';

function generateTeamCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

class TeamService {
  private teamsRef = collection(firestore, TEAMS_COLLECTION);
  private membersRef = collection(firestore, TEAM_MEMBERS_COLLECTION);

  async createTeam(input: CreateTeamInput, owner: UserProfile): Promise<Team> {
    const code = generateTeamCode();
    const teamDocRef = await addDoc(this.teamsRef, {
      name: input.name.trim(),
      description: input.description.trim(),
      code,
      ownerId: owner.id,
      ownerName: owner.name,
      createdAt: serverTimestamp(),
    });

    // Add owner as a member with 'owner' role
    const memberDocRef = doc(firestore, TEAM_MEMBERS_COLLECTION, `${teamDocRef.id}_${owner.id}`);
    await setDoc(memberDocRef, {
      teamId: teamDocRef.id,
      userId: owner.id,
      userName: owner.name,
      userEmail: owner.email,
      role: 'owner',
      joinedAt: serverTimestamp(),
    });

    return {
      id: teamDocRef.id,
      name: input.name.trim(),
      description: input.description.trim(),
      code,
      ownerId: owner.id,
      ownerName: owner.name,
      createdAt: Date.now(),
    };
  }

  async joinTeamByCode(code: string, user: UserProfile): Promise<Team> {
    const normalizedCode = code.trim().toUpperCase();
    const q = query(this.teamsRef, where('code', '==', normalizedCode));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      throw new Error('Mã nhóm không hợp lệ hoặc nhóm không tồn tại.');
    }

    const teamDoc = snapshot.docs[0];
    const teamData = teamDoc.data();
    const teamId = teamDoc.id;

    // Check if already a member
    const memberDocRef = doc(firestore, TEAM_MEMBERS_COLLECTION, `${teamId}_${user.id}`);
    const memberSnap = await getDoc(memberDocRef);

    if (!memberSnap.exists()) {
      await setDoc(memberDocRef, {
        teamId,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        role: 'member',
        joinedAt: serverTimestamp(),
      });
    }

    return {
      id: teamId,
      name: teamData.name || '',
      description: teamData.description || '',
      code: teamData.code || normalizedCode,
      ownerId: teamData.ownerId || '',
      ownerName: teamData.ownerName || '',
      createdAt:
        teamData.createdAt instanceof Timestamp
          ? teamData.createdAt.toMillis()
          : typeof teamData.createdAt === 'number'
            ? teamData.createdAt
            : Date.now(),
    };
  }

  async getTeamById(teamId: string): Promise<Team | null> {
    const teamRef = doc(firestore, TEAMS_COLLECTION, teamId);
    const snap = await getDoc(teamRef);
    if (!snap.exists()) return null;

    const data = snap.data();
    return {
      id: snap.id,
      name: data.name || '',
      description: data.description || '',
      code: data.code || '',
      ownerId: data.ownerId || '',
      ownerName: data.ownerName || '',
      createdAt:
        data.createdAt instanceof Timestamp
          ? data.createdAt.toMillis()
          : typeof data.createdAt === 'number'
            ? data.createdAt
            : Date.now(),
    };
  }

  subscribeUserTeams(
    userId: string,
    onSuccess: (teams: Team[]) => void,
    onError: (err: Error) => void
  ): () => void {
    // Query membership of this user
    const q = query(this.membersRef, where('userId', '==', userId));

    const unsubscribe = onSnapshot(
      q,
      async (membershipSnap) => {
        try {
          const teamIds = membershipSnap.docs.map((docSnap) => docSnap.data().teamId as string);

          if (teamIds.length === 0) {
            onSuccess([]);
            return;
          }

          // Fetch team documents
          const teamPromises = teamIds.map((tid) => this.getTeamById(tid));
          const teams = (await Promise.all(teamPromises)).filter((t): t is Team => t !== null);

          // Sort by creation date desc
          teams.sort((a, b) => b.createdAt - a.createdAt);
          onSuccess(teams);
        } catch (err: unknown) {
          const e = err instanceof Error ? err : new Error('Lỗi tải danh sách nhóm');
          onError(e);
        }
      },
      (err) => {
        console.error('Error subscribing user teams:', err);
        onError(err);
      }
    );

    return unsubscribe;
  }

  subscribeTeamMembers(
    teamId: string,
    onSuccess: (members: TeamMember[]) => void,
    onError: (err: Error) => void
  ): () => void {
    const q = query(this.membersRef, where('teamId', '==', teamId));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const members: TeamMember[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            teamId: data.teamId,
            userId: data.userId,
            userName: data.userName || 'Thành viên',
            userEmail: data.userEmail || '',
            role: data.role || 'member',
            joinedAt:
              data.joinedAt instanceof Timestamp
                ? data.joinedAt.toMillis()
                : typeof data.joinedAt === 'number'
                  ? data.joinedAt
                  : Date.now(),
          };
        });

        // Sort owners first, then by join time
        members.sort((a, b) => {
          if (a.role === 'owner' && b.role !== 'owner') return -1;
          if (b.role === 'owner' && a.role !== 'owner') return 1;
          return a.joinedAt - b.joinedAt;
        });

        onSuccess(members);
      },
      (err) => {
        console.error('Error subscribing team members:', err);
        onError(err);
      }
    );

    return unsubscribe;
  }
}

export const teamService = new TeamService();
