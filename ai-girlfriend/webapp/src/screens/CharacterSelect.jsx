import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { characters } from '../data/characters';

function CharacterSelect() {
  const navigate = useNavigate();

  return (
    <div className="screen">
      <Header title="Выберите персонажа" />
      
      <div className="character-grid">
        {characters.map((character) => (
          <div 
            key={character.id} 
            className="character-card"
            onClick={() => navigate(`/profile/${character.id}`)}
          >
            <div className="character-emoji">{character.emoji}</div>
            <h3>{character.name}</h3>
            <p>{character.shortDescription}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CharacterSelect;

