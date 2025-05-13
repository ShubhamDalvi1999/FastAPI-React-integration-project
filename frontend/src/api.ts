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

// Define interface for auth responses
export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface UserProfile {
  username: string;
  email: string;
}

// Set the API URL explicitly instead of relying on environment variables
const API_URL = 'http://localhost:8000';
console.log('Using API URL:', API_URL);

// Common axios config for all requests
const axiosConfig = {
  baseURL: API_URL,
  withCredentials: true, // Important for cookies/CORS
  headers: {
    'Content-Type': 'application/json',
  }
};

// Create an instance of axios with the base URL
const api: AxiosInstance = axios.create(axiosConfig);

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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

// Auth functions
export const loginUser = async (credentials: { username: string, password: string }): Promise<AuthResponse> => {
  try {
    const params = new URLSearchParams();
    params.append('username', credentials.username);
    params.append('password', credentials.password);

    const response = await axios.post(
      `${API_URL}/auth/token`,
      params,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const registerUser = async (userData: { username: string, email: string, password: string }): Promise<void> => {
  try {
    await axios.post(
      `${API_URL}/auth/register`, 
      userData,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const fetchUserProfile = async (token: string): Promise<UserProfile> => {
  try {
    const response = await axios.get(
      `${API_URL}/users/me/`, 
      {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Fetch user profile error:", error);
    throw error;
  }
};