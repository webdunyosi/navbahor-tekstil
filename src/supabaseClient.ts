import { createClient } from '@supabase/supabase-js';

const supabaseUrl: string | undefined = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey: string | undefined = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('VITE_SUPABASE_URL va VITE_SUPABASE_ANON_KEY .env faylida aniqlanishi kerak.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
