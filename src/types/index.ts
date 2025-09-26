export type UserRole = 'voter' | 'spectator';

export type VoteValue = '0' | '1' | '2' | '3' | '5' | '8' | '13' | '21' | '34' | '55' | '89' | 'coffee' | 'question';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  hasVoted: boolean;
  vote?: VoteValue;
}

export interface Room {
  id: string;
  users: User[];
  votesRevealed: boolean;
  createdAt: Date;
}

export interface SocketEvents {
  'join-room': { roomId: string; userName: string; role: UserRole };
  'user-joined': User;
  'user-left': string;
  'vote-cast': { userId: string; vote: VoteValue };
  'reveal-votes': void;
  'votes-revealed': Room;
  'reset-votes': void;
  'room-updated': Room;
  'error': string;
}