// Bun WebSocket 型定義
export interface BunWebSocket {
  send(data: string | ArrayBuffer | Buffer): void;
  data: { userId: string; username: string };
  readyState: number;
  ping(data?: string | ArrayBuffer | Buffer): void;
  pong(data?: string | ArrayBuffer | Buffer): void;
  close(code?: number, reason?: string): void;
}

// チャットメッセージの型定義
export interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: string;
  type: 'message' | 'join' | 'leave' | 'system';
}

// ユーザー情報の型定義
export interface User {
  id: string;
  username: string;
  ws: BunWebSocket;
}

// WebSocketメッセージの型定義
export interface WebSocketMessage {
  type: string;
  text?: string;
  [key: string]: unknown;
}
