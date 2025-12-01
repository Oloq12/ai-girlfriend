import { useNavigate } from 'react-router-dom';

function Header({ title, showBack = false }) {
  const navigate = useNavigate();

  return (
    <header className="header">
      {showBack && (
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Назад
        </button>
      )}
      <h2>{title}</h2>
    </header>
  );
}

export default Header;

