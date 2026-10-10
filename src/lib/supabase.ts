import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bhlrkhnpbtzytvllpvzk.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_O1tN7zSermfBAHK348I3Zg_kPHXoCQO';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
