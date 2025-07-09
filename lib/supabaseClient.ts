// lib/supabaseClient.ts

import { createBrowserClient } from '@supabase/ssr';

/**
 * Creates a Supabase client for use in browser-based components.
 * This client is safe to use in 'use client' components and authenticates
 * users based on the cookie set by the server.
 *
 * It uses the public URL and the public 'anon' key.
 */
export function createClient() {
  // These variables are exposed to the browser and are safe to use here
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}