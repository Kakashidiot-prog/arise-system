import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: async (username: string, password: string) => {
    const res = await api.post('/auth/register', { username, password });
    return res.data;
  },
  login: async (username: string, password: string) => {
    const res = await api.post('/auth/login', { username, password });
    return res.data;
  },
};

export const questsApi = {
  getAll: async () => {
    const res = await api.get('/quests');
    return res.data;
  },
  create: async (data: any) => {
    const res = await api.post('/quests', data);
    return res.data;
  },
  update: async (id: number, data: any) => {
    const res = await api.patch(`/quests/${id}`, data);
    return res.data;
  },
  updateTask: async (id: number, data: any) => {
    const res = await api.patch(`/quests/task/${id}`, data);
    return res.data;
  },
  delete: async (id: number) => {
    const res = await api.delete(`/quests/${id}`);
    return res.data;
  },
};

export const progressApi = {
  toggle: async (taskId: number) => {
    const res = await api.post('/progress/toggle', { taskId });
    return res.data;
  },
  increment: async (taskId: number, amount: number) => {
    const res = await api.post('/progress/increment', { taskId, amount });
    return res.data
  },
  getUserProgress: async () => {
    const res = await api.get('/progress');
    return res.data;
  },
  getStats: async () => {
    const res = await api.get('/progress/stats');
    return res.data;
  },
  getWeekActivity: async () => {
    const res = await api.get('/progress/week-activity');
    return res.data;
  },
  acceptWelcome: async () => {
    const res = await api.post('/progress/welcome');
    return res.data;
  }
};

export const logsApi = {
  getAll: async () => {
    const res = await api.get('/logs');
    return res.data;
  },
};

export const setToken = (token: string) => {
  localStorage.setItem('token', token);
};

export const getToken = () => localStorage.getItem('token');

export const removeToken = () => {
  localStorage.removeItem('token');
};

export default api;