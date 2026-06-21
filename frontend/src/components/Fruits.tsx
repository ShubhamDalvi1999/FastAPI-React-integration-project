import React, { useEffect, useState, useCallback } from 'react';
import api from "../api";
import type { Fruit } from "../api";
import AddFruitForm from './AddFruitForm';

const FruitList: React.FC = () => {
  const [fruits, setFruits] = useState<Fruit[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<boolean>(false);

  // GET request to fetch all fruits
  const fetchFruits = useCallback(async () => {
    setLoading(true);
    setError(null);
    setAuthError(false);
    
    const token = localStorage.getItem('token');
    if (!token) {
      setAuthError(true);
      setLoading(false);
      return;
    }
    
    try {
      const response = await api.get('/fruits', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setFruits(response.data.fruits || []);
    } catch (error: any) {
      console.error("Error fetching fruits", error);
      if (error.response?.status === 401) {
        setAuthError(true);
      } else {
        setError("Failed to load fruits");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // POST request to add a new fruit
  const addFruit = async (fruitName: string): Promise<void> => {
    const token = localStorage.getItem('token');
    if (!token) {
      setAuthError(true);
      return;
    }
    
    try {
      await api.post('/fruits', 
        { name: fruitName },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      fetchFruits();  // Refresh the list after adding a fruit
    } catch (error: any) {
      console.error("Error adding fruit", error);
      if (error.response?.status === 401) {
        setAuthError(true);
      } else {
        setError("Failed to add fruit");
      }
    }
  };

  // Fetch fruits when the component mounts
  useEffect(() => {
    fetchFruits();
  }, [fetchFruits]); // Include fetchFruits in dependency array to fix the linter warning

  if (authError) {
    return (
      <div className="auth-error">
        <p>Authentication required. Please log in to view and manage fruits.</p>
      </div>
    );
  }

  if (loading) {
    return <div>Loading fruits...</div>;
  }

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button type="button" onClick={fetchFruits}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="fruits-container">
      <h2>Fruits List</h2>
      {fruits.length === 0 ? (
        <p className="fruits-empty">No fruits available. Add some!</p>
      ) : (
        <ul>
          {fruits.map((fruit) => (
            <li key={fruit.id || `fruit-${fruit.name}`}>{fruit.name}</li>
          ))}
        </ul>
      )}
      <AddFruitForm addFruit={addFruit} />
    </div>
  );
};

export default FruitList; 