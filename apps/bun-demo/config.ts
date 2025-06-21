// アプリケーション設定
export const config = {
  // サーバーポート設定
  ports: {
    http: parseInt(process.env.HTTP_PORT || '3000'),
    api: parseInt(process.env.API_PORT || '3001'),
    websocket: parseInt(process.env.WS_PORT || '3003'),
  },

  // WebSocket設定
  websocket: {
    reconnectDelay: parseInt(process.env.WS_RECONNECT_DELAY || '3000'),
    maxHistory: parseInt(process.env.WS_MAX_HISTORY || '50'),
    url: process.env.WS_URL || 'ws://localhost:3003/chat',
  },

  // Worker設定
  worker: {
    poolSize: parseInt(process.env.WORKER_POOL_SIZE || '0') || undefined,
  },

  // CORS設定
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: 'GET, POST, PUT, DELETE',
    headers: 'Content-Type',
  },

  // ビルド設定
  build: {
    outDir: process.env.BUILD_OUT_DIR || './dist',
  },

  // 環境設定
  env: {
    isCI: process.env.CI === 'true',
    isDevelopment: process.env.NODE_ENV !== 'production',
    isProduction: process.env.NODE_ENV === 'production',
  },
} as const;
