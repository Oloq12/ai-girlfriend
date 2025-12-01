import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CharacterSelect from './screens/CharacterSelect';
import CharacterProfile from './screens/CharacterProfile';
import Chat from './screens/Chat';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CharacterSelect />} />
        <Route path="/profile/:id" element={<CharacterProfile />} />
        <Route path="/chat/:id" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

