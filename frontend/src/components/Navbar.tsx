import React from 'react';

interface NavbarProps {
  isAuthenticated: boolean;
  username: string | null;
  onLogout: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Navbar: React.FC<NavbarProps> = ({ 
  isAuthenticated, 
  username, 
  onLogout, 
  onNavigate, 
  currentPage 
}) => {
  return (
    <nav className="navbar">
      <div className="logo">
        <h1>Fruit Management App</h1>
      </div>
      <div className="nav-links">
        <button 
          className={`nav-btn ${currentPage === 'home' ? 'active' : ''}`}
          onClick={() => onNavigate('home')}
        >
          Home
        </button>
        
        {isAuthenticated && (
          <button 
            className={`nav-btn ${currentPage === 'fruits' ? 'active' : ''}`}
            onClick={() => onNavigate('fruits')}
          >
            Fruits
          </button>
        )}
        
        {isAuthenticated && (
          <button 
            className={`nav-btn ${currentPage === 'profile' ? 'active' : ''}`}
            onClick={() => onNavigate('profile')}
          >
            Profile
          </button>
        )}
      </div>
      <div className="auth-section">
        {isAuthenticated ? (
          <div className="user-info">
            <span>Welcome, {username}</span>
            <button onClick={onLogout} className="logout-btn">Logout</button>
          </div>
        ) : (
          <div className="login-buttons">
            <button 
              className={`nav-btn ${currentPage === 'login' ? 'active' : ''}`}
              onClick={() => onNavigate('login')}
            >
              Login
            </button>
            <button 
              className={`nav-btn ${currentPage === 'register' ? 'active' : ''}`}
              onClick={() => onNavigate('register')}
            >
              Register
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 