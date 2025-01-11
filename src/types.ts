export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface Seat {
  id: number;
  row: number;
  column: number;
  isBooked: boolean;
  userId?: string;
}

export interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
}