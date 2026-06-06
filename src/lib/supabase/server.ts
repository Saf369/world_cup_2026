/**
 * MUNDIAL — Server Supabase Client
 * Use this in Server Components, Route Handlers, and Server Actions.
 * Reads/writes cookies from Next.js headers — never exposes service key to browser.
 */

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '../database.generated';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // setAll() from a Server Component is silently ignored —
            // middleware handles refresh instead.
          }
        },
      },
    },
  );
}

/**
 * Admin client using the service-role key.
 * NEVER import this in client-side code.
 * Only for server-side seed scripts and admin operations.
 */
export async function createAdminClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // silently ignore from Server Components
          }
        },
      },
    },
  );
}
