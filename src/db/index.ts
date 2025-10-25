import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const env = process.env;

if (!env.SUPABASE_API_URL) { throw Error('SUPABASE_API_URL must be provided in .env') };
if (!env.SUPABASE_PUB_KEY) { throw Error('SUPABASE_PUB_KEY must be provided in .env') };

export const db = createClient(env.SUPABASE_API_URL, env.SUPABASE_PUB_KEY);
