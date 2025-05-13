import React, { useEffect, useState, useCallback } from 'react';
import api from "../api";
import type { Fruit } from "../api";
import AddFruitForm from './AddFruitForm';

const FruitList: React.FC = () => {
  const [fruits, setFruits] = useState<Fruit[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // GET request to fetch all fruits
  const fetchFruits = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/fruits');
      setFruits(response.data.fruits || []);
    } catch (error) {
      console.error("Error fetching fruits", error);
      setError("Failed to load fruits");
    } finally {
      setLoading(false);
    }
  }, []);

  // POST request to add a new fruit
  const addFruit = async (fruitName: string): Promise<void> => {
    try {
      await api.post('/fruits', { name: fruitName });
      fetchFruits();  // Refresh the list after adding a fruit
    } catch (error) {
      console.error("Error adding fruit", error);
      setError("Failed to add fruit");
    }
  };

  // Fetch fruits when the component mounts
  useEffect(() => {
    fetchFruits();
  }, [fetchFruits]); // Include fetchFruits in dependency array to fix the linter warning

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
    <div>
      <h2>Fruits List</h2>
      {fruits.length === 0 ? (
        <p>No fruits available. Add some!</p>
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