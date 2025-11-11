import { User, Image, Thread } from './types';

const API_BASE_URL = 'http://localhost:3001';

export const api = {
  // Public endpoints
  createUser: async (name: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create user');
    }
    return response.json();
  },

  login: async (name: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }
    const data = await response.json();
    return data.user;
  },

  // Protected endpoints
  getUsers: async (username: string): Promise<User[]> => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: { 'X-User-Name': username }
    });
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  createImage: async (username: string): Promise<Image> => {
    const response = await fetch(`${API_BASE_URL}/images`, {
      method: 'POST',
      headers: { 'X-User-Name': username }
    });
    if (!response.ok) throw new Error('Failed to create image');
    return response.json();
  },

  getImages: async (username: string): Promise<Image[]> => {
    const response = await fetch(`${API_BASE_URL}/images`, {
      headers: { 'X-User-Name': username }
    });
    if (!response.ok) throw new Error('Failed to fetch images');
    return response.json();
  },

  createThread: async (username: string, imageId: string, x: number, y: number, comment: string): Promise<Thread> => {
    const response = await fetch(`${API_BASE_URL}/images/${imageId}/threads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Name': username
      },
      body: JSON.stringify({ x, y, comment })
    });
    if (!response.ok) throw new Error('Failed to create thread');
    return response.json();
  },

  getThreads: async (username: string, imageId: string): Promise<Thread[]> => {
    const response = await fetch(`${API_BASE_URL}/images/${imageId}/threads`, {
      headers: { 'X-User-Name': username }
    });
    if (!response.ok) throw new Error('Failed to fetch threads');
    return response.json();
  },

  deleteThread: async (username: string, threadId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/threads/${threadId}`, {
      method: 'DELETE',
      headers: { 'X-User-Name': username }
    });
    if (!response.ok) throw new Error('Failed to delete thread');
  },

  deleteImage: async (username: string, imageId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/images/${imageId}`, {
      method: 'DELETE',
      headers: { 'X-User-Name': username }
    });
    if (!response.ok) throw new Error('Failed to delete image');
  },

  updateThreadPosition: async (username: string, threadId: string, x: number, y: number): Promise<Thread> => {
    const response = await fetch(`${API_BASE_URL}/threads/${threadId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Name': username
      },
      body: JSON.stringify({ x, y })
    });
    if (!response.ok) throw new Error('Failed to update thread position');
    return response.json();
  }
};

