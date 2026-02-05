export interface ChatMessage {
  id: number;
  role: string;
  message: string;
  sessionId: number;
  createdAt: string;
}

export interface Session {
  id: number;
  title?: string;
  messages: ChatMessage[];
}

export interface User {
  id: number;
  username: string;
  email: string;
  sessions: Session[];
}
