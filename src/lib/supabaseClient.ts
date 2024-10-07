import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = process.env.SUPABASE_URL || import.meta.env.SUPABASE_URL;
export const supabaseServiceKey = process.env.SERVICE_KEY || import.meta.env.SERVICE_KEY;
export const supabase = createClient(supabaseUrl, supabaseServiceKey);
