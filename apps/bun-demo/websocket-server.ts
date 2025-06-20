// WebSocketチャットサーバー
interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: string;
  type: "message" | "join" | "leave" | "system";
}

interface User {
  id: string;
  username: string;
  ws: any; // WebSocket instance
}

const users = new Map<string, User>();
const messageHistory: ChatMessage[] = [];
const MAX_HISTORY = 50;

// ユーザー名生成
function generateUsername(): string {
  const adjectives = ["Happy", "Lucky", "Sunny", "Cool", "Swift"];
  const animals = ["Cat", "Dog", "Fox", "Bear", "Bird"];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  return `${adj}${animal}${Math.floor(Math.random() * 1000)}`;
}

// メッセージをブロードキャスト
function broadcast(message: ChatMessage, excludeId?: string) {
  const data = JSON.stringify(message);
  
  for (const [userId, user] of users) {
    if (userId !== excludeId) {
      user.ws.send(data);
    }
  }
  
  // 履歴に追加
  messageHistory.push(message);
  if (messageHistory.length > MAX_HISTORY) {
    messageHistory.shift();
  }
}

// オンラインユーザーリストを送信
function sendUserList() {
  const userList = Array.from(users.values()).map(u => ({
    id: u.id,
    username: u.username
  }));
  
  const message = JSON.stringify({
    type: "userList",
    users: userList
  });
  
  for (const user of users.values()) {
    user.ws.send(message);
  }
}

const server = Bun.serve({
  port: 3003,
  
  fetch(req, server) {
    const url = new URL(req.url);
    
    // WebSocketアップグレード
    if (url.pathname === "/chat") {
      const success = server.upgrade(req);
      if (success) {
        return undefined;
      }
    }
    
    // チャットクライアントHTML
    if (url.pathname === "/") {
      return new Response(chatClientHTML, {
        headers: { "Content-Type": "text/html; charset=utf-8" }
      });
    }
    
    return new Response("Not Found", { status: 404 });
  },
  
  websocket: {
    open(ws) {
      const userId = crypto.randomUUID();
      const username = generateUsername();
      
      users.set(userId, { id: userId, username, ws });
      
      // 接続情報を保存
      ws.data = { userId, username };
      
      // 履歴を送信
      ws.send(JSON.stringify({
        type: "history",
        messages: messageHistory
      }));
      
      // 参加メッセージ
      const joinMessage: ChatMessage = {
        id: crypto.randomUUID(),
        username: "System",
        message: `${username} が参加しました`,
        timestamp: new Date().toISOString(),
        type: "join"
      };
      broadcast(joinMessage);
      
      // 自分の情報を送信
      ws.send(JSON.stringify({
        type: "welcome",
        userId,
        username
      }));
      
      // ユーザーリスト更新
      sendUserList();
      
      console.log(`👤 ${username} が接続しました`);
    },
    
    message(ws, message) {
      const { userId, username } = ws.data;
      
      try {
        const data = JSON.parse(message.toString());
        
        if (data.type === "message" && data.text) {
          const chatMessage: ChatMessage = {
            id: crypto.randomUUID(),
            username,
            message: data.text,
            timestamp: new Date().toISOString(),
            type: "message"
          };
          
          // 自分にも送信
          ws.send(JSON.stringify(chatMessage));
          
          // 他のユーザーにブロードキャスト
          broadcast(chatMessage, userId);
          
          console.log(`💬 ${username}: ${data.text}`);
        }
      } catch (error) {
        console.error("メッセージ処理エラー:", error);
      }
    },
    
    close(ws) {
      const { userId, username } = ws.data;
      
      users.delete(userId);
      
      // 退出メッセージ
      const leaveMessage: ChatMessage = {
        id: crypto.randomUUID(),
        username: "System",
        message: `${username} が退出しました`,
        timestamp: new Date().toISOString(),
        type: "leave"
      };
      broadcast(leaveMessage);
      
      // ユーザーリスト更新
      sendUserList();
      
      console.log(`👋 ${username} が切断しました`);
    }
  }
});

// チャットクライアントHTML
const chatClientHTML = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bun WebSocket チャット</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 20px;
      background: #f0f2f5;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      display: flex;
      height: 600px;
    }
    .chat-area {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .header {
      padding: 20px;
      border-bottom: 1px solid #e0e0e0;
      background: #7c3aed;
      color: white;
      border-radius: 10px 0 0 0;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .user-info {
      font-size: 14px;
      opacity: 0.9;
      margin-top: 5px;
    }
    .messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
    }
    .message {
      margin-bottom: 15px;
      animation: fadeIn 0.3s ease;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .message.own {
      text-align: right;
    }
    .message-content {
      display: inline-block;
      padding: 10px 15px;
      border-radius: 18px;
      max-width: 70%;
      word-break: break-word;
    }
    .message.own .message-content {
      background: #7c3aed;
      color: white;
    }
    .message:not(.own) .message-content {
      background: #f0f0f0;
      color: #333;
    }
    .message-info {
      font-size: 12px;
      color: #999;
      margin: 5px 0;
    }
    .system-message {
      text-align: center;
      color: #666;
      font-style: italic;
      margin: 10px 0;
      font-size: 14px;
    }
    .input-area {
      padding: 20px;
      border-top: 1px solid #e0e0e0;
      display: flex;
      gap: 10px;
    }
    .input-area input {
      flex: 1;
      padding: 12px 20px;
      border: 1px solid #ddd;
      border-radius: 25px;
      font-size: 16px;
      outline: none;
    }
    .input-area input:focus {
      border-color: #7c3aed;
    }
    .input-area button {
      padding: 12px 30px;
      background: #7c3aed;
      color: white;
      border: none;
      border-radius: 25px;
      font-size: 16px;
      cursor: pointer;
      transition: background 0.2s;
    }
    .input-area button:hover {
      background: #6b2fc7;
    }
    .input-area button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
    .sidebar {
      width: 200px;
      border-left: 1px solid #e0e0e0;
      padding: 20px;
      background: #fafafa;
      border-radius: 0 10px 10px 0;
    }
    .sidebar h3 {
      margin: 0 0 15px 0;
      font-size: 16px;
      color: #666;
    }
    .user-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .user-list li {
      padding: 8px 12px;
      background: white;
      margin-bottom: 5px;
      border-radius: 5px;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .user-list li:before {
      content: "●";
      color: #4ade80;
      font-size: 10px;
    }
    .connection-status {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 10px 20px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.3s;
    }
    .connection-status.connected {
      background: #4ade80;
      color: white;
    }
    .connection-status.disconnected {
      background: #ef4444;
      color: white;
    }
  </style>
</head>
<body>
  <div class="connection-status disconnected">切断中</div>
  
  <div class="container">
    <div class="chat-area">
      <div class="header">
        <h1>🚀 Bun WebSocket チャット</h1>
        <div class="user-info">ユーザー名: <span id="username">接続中...</span></div>
      </div>
      
      <div class="messages" id="messages"></div>
      
      <div class="input-area">
        <input 
          type="text" 
          id="messageInput" 
          placeholder="メッセージを入力..." 
          disabled
          autocomplete="off"
        >
        <button id="sendButton" disabled>送信</button>
      </div>
    </div>
    
    <div class="sidebar">
      <h3>オンラインユーザー</h3>
      <ul class="user-list" id="userList"></ul>
    </div>
  </div>

  <script>
    let ws = null;
    let userId = null;
    let username = null;
    
    const messagesEl = document.getElementById('messages');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const usernameEl = document.getElementById('username');
    const userListEl = document.getElementById('userList');
    const statusEl = document.querySelector('.connection-status');
    
    function connect() {
      ws = new WebSocket('ws://localhost:3003/chat');
      
      ws.onopen = () => {
        console.log('WebSocket接続成功');
        statusEl.textContent = '接続済み';
        statusEl.className = 'connection-status connected';
        messageInput.disabled = false;
        sendButton.disabled = false;
        messageInput.focus();
      };
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.type === 'welcome') {
          userId = data.userId;
          username = data.username;
          usernameEl.textContent = username;
        } else if (data.type === 'history') {
          data.messages.forEach(msg => displayMessage(msg));
        } else if (data.type === 'userList') {
          updateUserList(data.users);
        } else if (data.type === 'message' || data.type === 'join' || data.type === 'leave') {
          displayMessage(data);
        }
      };
      
      ws.onclose = () => {
        console.log('WebSocket切断');
        statusEl.textContent = '切断中';
        statusEl.className = 'connection-status disconnected';
        messageInput.disabled = true;
        sendButton.disabled = true;
        
        // 3秒後に再接続
        setTimeout(connect, 3000);
      };
      
      ws.onerror = (error) => {
        console.error('WebSocketエラー:', error);
      };
    }
    
    function displayMessage(data) {
      const isOwn = data.username === username;
      const isSystem = data.type === 'join' || data.type === 'leave';
      
      const messageEl = document.createElement('div');
      
      if (isSystem) {
        messageEl.className = 'system-message';
        messageEl.textContent = data.message;
      } else {
        messageEl.className = 'message' + (isOwn ? ' own' : '');
        
        const infoEl = document.createElement('div');
        infoEl.className = 'message-info';
        infoEl.textContent = isOwn ? 'あなた' : data.username;
        
        const contentEl = document.createElement('div');
        contentEl.className = 'message-content';
        contentEl.textContent = data.message;
        
        messageEl.appendChild(infoEl);
        messageEl.appendChild(contentEl);
      }
      
      messagesEl.appendChild(messageEl);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }
    
    function updateUserList(users) {
      userListEl.innerHTML = '';
      users.forEach(user => {
        const li = document.createElement('li');
        li.textContent = user.username;
        if (user.id === userId) {
          li.style.fontWeight = 'bold';
        }
        userListEl.appendChild(li);
      });
    }
    
    function sendMessage() {
      const text = messageInput.value.trim();
      if (text && ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'message', text }));
        messageInput.value = '';
      }
    }
    
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
    
    // 初回接続
    connect();
  </script>
</body>
</html>
`;

console.log(`🌐 WebSocketチャットサーバーが起動しました: http://localhost:${server.port}`);