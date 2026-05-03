import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const signUp = async (email: string, password: string, role: string, name: string) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (data.user) {
    await supabase.from('users').insert({
      auth_id: data.user.id,
      email,
      name,
      role,
      profile_complete: false
    });
  }
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};
