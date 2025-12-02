import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { getCharacterById } from '../data/characters';

function CharacterProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const character = getCharacterById(id);

  if (!character) {
    return (
      <div className="screen">
        <Header title="Ошибка" />
        <p>Персонаж не найден</p>
      </div>
    );
  }

  return (
    <div className="screen">
      <Header title="Профиль" showBack={true} />
      
      <div className="profile-container">
        <div className="profile-emoji">{character.emoji}</div>
        <h1>{character.name}</h1>
        <p className="profile-description">{character.shortDescription}</p>
        <p className="profile-bio">{character.fullDescription}</p>
        
        <button 
          className="primary-button"
          onClick={() => navigate(`/chat/${id}`)}
        >
          Начать общение
        </button>
      </div>
    </div>
  );
}

export default CharacterProfile;

