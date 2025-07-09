// lib/supabase/server.ts

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

// This function creates a Supabase client for Server Components, Server Actions, and Route Handlers.
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // CORRECTED: The `get` method is now `async`.
        async get(name: string) {
            // @ts-ignore

          return cookieStore.get(name)?.value;
        },
        // CORRECTED: The `set` method is added and made `async`. This is required for login/logout/signup to work.
        async set(name: string, value: string, options: CookieOptions) {
          try {
            // @ts-ignore

            await cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing cookies.
          }
        },
        // CORRECTED: The `remove` method is added and made `async`. This is required for logout to work.
        async remove(name: string, options: CookieOptions) {
          try {
            // @ts-ignore
            await cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing cookies.
          }
        },
      },
    }
  );
}