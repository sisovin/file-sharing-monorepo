import { supabase } from './supabaseClient';

export const login = async (email: string, password: string) => {
  const { user, error } = await supabase.auth.signIn({ email, password });
  if (error) {
    throw new Error(error.message);
  }
  return user;
};

export const register = async (email: string, password: string) => {
  const { user, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    throw new Error(error.message);
  }
  return user;
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
};

export const getCurrentUser = async () => {
  const user = supabase.auth.user();
  if (!user) {
    throw new Error('No user is currently logged in');
  }
  return user;
};
