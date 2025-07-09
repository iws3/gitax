// lib/client.ts (or your existing lib/supabaseClient.ts)
import { createBrowserClient } from '@supabase/ssr'; // Use createBrowserClient for client components

// These variables come from your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// createBrowserClient is recommended for client components in App Router
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);