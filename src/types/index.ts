export interface User {
  _id?: string;  // MongoDB ID
  id?: string;   // Frontend ID (normalized from _id)
  username: string;
  email: string;
  rating: number;
  gamesPlayed?: number;
  gamesWon?: number;
  gamesLost?: number;
  gamesDrawn?: number;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface LoginCredentials {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface Game {
  _id?: string;  // MongoDB ID
  id?: string;   // Frontend ID (normalized from _id)
  gameName?: string;
  whitePlayer: User | string;
  blackPlayer?: User | string;
  status: GameStatus;
  currentTurn: 'white' | 'black';
  currentPosition: string; // FEN notation
  moves: Move[];
  timeControlInitial: number;
  timeControlIncrement: number;
  whiteTimeRemaining?: number;
  blackTimeRemaining?: number;
  result?: GameResult;
  winner?: string;
  startedAt?: Date;
  endedAt?: Date;
  createdAt: Date;
}

export enum GameStatus {
  WAITING = 'waiting',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned',
}

export enum GameResult {
  WHITE_WINS = 'white_wins',
  BLACK_WINS = 'black_wins',
  DRAW = 'draw',
  STALEMATE = 'stalemate',
}

export interface Move {
  from: string;
  to: string;
  piece: string;
  color: 'white' | 'black';
  algebraicNotation: string;
  timestamp: Date;
  isCheck?: boolean;
  isCheckmate?: boolean;
  isCastling?: boolean;
  isEnPassant?: boolean;
  promotion?: string;
}

export interface CreateGameDto {
  gameName?: string;
  timeControlMinutes?: number;
  timeIncrementSeconds?: number;
}

export interface MakeMoveDto {
  from: string;
  to: string;
  piece: string;
  promotion?: string;
}
