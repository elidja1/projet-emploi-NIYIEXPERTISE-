export interface User {
  id: string;
  name: string;
  color: string;
  isTyping: boolean;
  x: number; // Cursor X position (col)
  y: number; // Cursor Y position (row)
  operationCount: number;
}

export interface ChatMessage {
  id: string;
  userId: string;
  text: string;
  timestamp: string;
}

export interface LogEntry {
  id: string;
  text: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface EditorState {
  docName: string;
  content: string[]; // Array of lines
  users: User[];
  chat: ChatMessage[];
  logs: LogEntry[];
  isConnected: boolean;
  isSyncing: boolean;
  lastSynced: string | null;
  latency: number;
  theme: 'light' | 'dark';
}
