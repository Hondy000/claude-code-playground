/* eslint-disable no-console */
// Bunの高度なAPIサーバー実装
import { Database } from 'bun:sqlite';
import { config } from './config';

// メモリ内SQLiteデータベースを作成
const db = new Database(':memory:');

// テーブル作成
db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    completed BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// 初期データ
db.exec(`
  INSERT INTO todos (text) VALUES 
  ('Bunを学ぶ'),
  ('高速なAPIを作る'),
  ('SQLiteを試す')
`);

const server = Bun.serve({
  port: config.ports.api,
  async fetch(request) {
    const url = new URL(request.url);
    const method = request.method;

    // CORS対応
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': config.cors.origin,
      'Access-Control-Allow-Methods': config.cors.methods,
      'Access-Control-Allow-Headers': config.cors.headers,
    };

    // プリフライトリクエスト対応
    if (method === 'OPTIONS') {
      return new Response(null, { headers });
    }

    // ルーティング
    if (url.pathname === '/api/todos' && method === 'GET') {
      const todos = db.query('SELECT * FROM todos ORDER BY id DESC').all();
      return Response.json({ todos }, { headers });
    }

    if (url.pathname === '/api/todos' && method === 'POST') {
      const body = (await request.json()) as { text: string };
      const stmt = db.prepare('INSERT INTO todos (text) VALUES (?)');
      const result = stmt.run(body.text);

      const newTodo = db.query('SELECT * FROM todos WHERE id = ?').get(result.lastInsertRowid);
      return Response.json({ todo: newTodo }, { headers, status: 201 });
    }

    if (url.pathname.startsWith('/api/todos/') && method === 'PUT') {
      const id = url.pathname.split('/').pop();
      if (!id) {
        return Response.json({ error: 'Invalid ID' }, { headers, status: 400 });
      }
      const body = (await request.json()) as { completed: boolean };

      db.prepare('UPDATE todos SET completed = ? WHERE id = ?').run(body.completed ? 1 : 0, id);

      const updatedTodo = db.query('SELECT * FROM todos WHERE id = ?').get(id);
      return Response.json({ todo: updatedTodo }, { headers });
    }

    if (url.pathname.startsWith('/api/todos/') && method === 'DELETE') {
      const id = url.pathname.split('/').pop();
      if (!id) {
        return Response.json({ error: 'Invalid ID' }, { headers, status: 400 });
      }
      db.prepare('DELETE FROM todos WHERE id = ?').run(id);

      return Response.json({ success: true }, { headers });
    }

    // システム情報エンドポイント
    if (url.pathname === '/api/info') {
      return Response.json(
        {
          runtime: 'Bun',
          version: Bun.version,
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          platform: process.platform,
        },
        { headers },
      );
    }

    return new Response('Not Found', { status: 404, headers });
  },
});

console.log(`APIサーバーが起動しました: http://localhost:${server.port}/api/todos`);
