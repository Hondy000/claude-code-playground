/* eslint-disable no-console */
// TypeScriptの型安全性を活かしたBunのデモ

// 型定義
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: Date;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

// ユーザーデータ（実際のアプリではDBから取得）
const users: User[] = [
  {
    id: 1,
    name: '田中太郎',
    email: 'tanaka@example.com',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 2,
    name: '鈴木花子',
    email: 'suzuki@example.com',
    role: 'user',
    createdAt: new Date('2024-02-15'),
  },
];

// ユーティリティ関数（ジェネリクス使用）
function createApiResponse<T>(data?: T, error?: string): ApiResponse<T> {
  return {
    success: !error,
    data,
    error,
    timestamp: new Date().toISOString(),
  };
}

// バリデーション関数（型ガード）
function isValidUser(data: any): data is Omit<User, 'id' | 'createdAt'> {
  return (
    typeof data.name === 'string' &&
    typeof data.email === 'string' &&
    ['admin', 'user', 'guest'].includes(data.role)
  );
}

// APIサーバー
const server = Bun.serve({
  port: 3002,
  async fetch(request): Promise<Response> {
    const url = new URL(request.url);
    const method = request.method;

    // ヘッダーを型で定義
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'X-Powered-By': 'Bun with TypeScript',
    };

    try {
      // ユーザー一覧取得
      if (url.pathname === '/api/users' && method === 'GET') {
        const response = createApiResponse(users);
        return Response.json(response, { headers });
      }

      // ユーザー詳細取得
      if (url.pathname.match(/^\/api\/users\/\d+$/) && method === 'GET') {
        const id = parseInt(url.pathname.split('/').pop()!);
        const user = users.find((u) => u.id === id);

        if (!user) {
          const response = createApiResponse<User>(undefined, 'User not found');
          return Response.json(response, { status: 404, headers });
        }

        const response = createApiResponse(user);
        return Response.json(response, { headers });
      }

      // ユーザー作成
      if (url.pathname === '/api/users' && method === 'POST') {
        const body = await request.json();

        if (!isValidUser(body)) {
          const response = createApiResponse<User>(undefined, 'Invalid user data');
          return Response.json(response, { status: 400, headers });
        }

        const newUser: User = {
          id: users.length + 1,
          ...body,
          createdAt: new Date(),
        };

        users.push(newUser);
        const response = createApiResponse(newUser);
        return Response.json(response, { status: 201, headers });
      }

      // 404
      const response = createApiResponse(undefined, 'Endpoint not found');
      return Response.json(response, { status: 404, headers });
    } catch (error) {
      const response = createApiResponse(
        undefined,
        error instanceof Error ? error.message : 'Internal server error',
      );
      return Response.json(response, { status: 500, headers });
    }
  },
});

console.log(`TypeScript APIサーバーが起動しました: http://localhost:${server.port}/api/users`);

// 型の恩恵を確認するためのコード例
// 以下はコンパイル時にエラーになる例（コメントアウト）
// const invalidUser: User = {
//   id: 1,
//   name: 123, // Error: Type 'number' is not assignable to type 'string'
//   email: "test@example.com",
//   role: "superuser", // Error: Type '"superuser"' is not assignable to type '"admin" | "user" | "guest"'
//   createdAt: new Date(),
// };
