import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';

// Define interface for fruit data
export interface Fruit {
  id?: number;
  name: string;
}

// Define interface for API response
export interface ApiResponse<T> {
  fruits?: T[];
  success: boolean;
  message?: string;
}

// Set the API URL explicitly instead of relying on environment variables
const API_URL = 'http://localhost:8000';
console.log('Using API URL:', API_URL);

// Create an instance of axios with the base URL
const api: AxiosInstance = axios.create({
  baseURL: API_URL
});

// Export the Axios instance
export default api;

// Define a function to get all fruits
export const getFruits = async (): Promise<Fruit[]> => {
  try {
    const response: AxiosResponse<ApiResponse<Fruit>> = await api.get('/fruits');
    return response.data.fruits || [];
  } catch (error) {
    console.error("Error fetching fruits:", error);
    return [];
  }
};

// Define a function to add a fruit
export const addFruit = async (name: string): Promise<boolean> => {
  try {
    const response: AxiosResponse<ApiResponse<Fruit>> = await api.post('/fruits', { name });
    return response.data.success;
  } catch (error) {
    console.error("Error adding fruit:", error);
    return false;
  }
}; 