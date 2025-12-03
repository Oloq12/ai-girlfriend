import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CharacterSelectScreen, CharacterProfileScreen, ChatScreen } from '@/screens';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CharacterSelectScreen />} />
        <Route path="/profile/:id" element={<CharacterProfileScreen />} />
        <Route path="/chat/:id" element={<ChatScreen />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

