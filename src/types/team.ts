export type TeamRole = 'owner' | 'member';

export interface Team {
  id: string;
  name: string;
  description: string;
  code: string; // 6-character code for joining
  ownerId: string;
  ownerName?: string;
  createdAt: number;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  userName: string;
  userEmail: string;
  role: TeamRole;
  joinedAt: number;
}

export interface CreateTeamInput {
  name: string;
  description: string;
}
