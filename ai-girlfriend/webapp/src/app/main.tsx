import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initTelegramWebApp } from '@/lib/telegram/telegram';
import '@/styles/global.css';

// Инициализация Telegram WebApp
initTelegramWebApp();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

