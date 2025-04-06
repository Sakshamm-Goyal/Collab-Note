import { Database } from '@/supabase';
import { createClient } from '@supabase/supabase-js';

// Create a single instance of the Supabase client
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  process.env.NEXT_PUBLIC_SUPABASE_KEY ?? '',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);

const rooms = supabase.from('Rooms').select();
