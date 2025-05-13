import React, { useState, useEffect } from 'react';
import './App.css';
import FruitList from './components/Fruits';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Profile from './components/Profile';
import { fetchUserProfile } from './api';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [loading, setLoading] = useState<boolean>(true);

  // Check for stored token on mount and validate it
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
      
      try {
        // Verify token by fetching user profile
        const profile = await fetchUserProfile(token);
        setUsername(profile.username);
        setIsAuthenticated(true);
      } catch (error) {
        // Token invalid or expired
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, []);

  const handleLogin = async (token: string) => {
    try {
      const profile = await fetchUserProfile(token);
      setUsername(profile.username);
      setIsAuthenticated(true);
      setCurrentPage('fruits');
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUsername(null);
    setCurrentPage('home');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const handleRegistrationSuccess = () => {
    setCurrentPage('login');
  };

  if (loading) {
    return <div className="loading">Loading application...</div>;
  }

  // Render current page based on state
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'login':
        return <Login onLogin={handleLogin} />;
      case 'register':
        return <Register onRegistrationSuccess={handleRegistrationSuccess} />;
      case 'fruits':
        return isAuthenticated ? <FruitList /> : <Login onLogin={handleLogin} />;
      case 'profile':
        return isAuthenticated ? <Profile /> : <Login onLogin={handleLogin} />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="App">
      <Navbar 
        isAuthenticated={isAuthenticated}
        username={username}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        currentPage={currentPage}
      />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
};

export default App; 