import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'VITE_SUPABASE_URL va VITE_SUPABASE_ANON_KEY .env faylida aniqlanishi kerak.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
