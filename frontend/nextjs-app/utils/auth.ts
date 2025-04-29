import { api } from './api';

export const login = async (email: string, password: string) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
};

export const register = async (email: string, password: string) => {
  const { data } = await api.post('/auth/register', { email, password });
  return data;
};

export const logout = async () => {
  await api.post('/auth/logout');
};

export const getCurrentUser = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};
