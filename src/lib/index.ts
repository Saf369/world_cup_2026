/**
 * MUNDIAL — lib barrel export
 * Import everything from '@/lib' for convenience.
 */

export * from './database.types';
export * from './db';
export { createClient as createBrowserClient } from './supabase/client';
// NOTE: Server client uses async cookies — import directly from './supabase/server'
