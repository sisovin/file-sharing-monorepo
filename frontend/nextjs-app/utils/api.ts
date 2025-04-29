import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SUPABASE_API_URL,
  withCredentials: true,
});

export { api };
