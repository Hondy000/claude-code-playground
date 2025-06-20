import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

// パフォーマンス測定
console.time('React App 初期化');

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.timeEnd('React App 初期化');

// HMR (Hot Module Replacement) サポート
if (module.hot) {
  module.hot.accept();
}