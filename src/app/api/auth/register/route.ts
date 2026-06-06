/**
 * POST /api/auth/register
 * Complete new user registration after Google OAuth via Supabase.
 * Reads the authenticated user from the Supabase session (no raw idToken needed).
 * Creates a row in our custom users table and initialises standings.
 */

import { NextRequest } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { created, badRequest, conflict, unauthorized, serverError } from '@/lib/utils/response';
import logger from '@/lib/utils/logger';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json().catch(() => ({}));
    const { name, phone } = body as { name?: string; phone?: string };

    if (!name?.trim())  return badRequest('name is required');
    if (!phone?.trim()) return badRequest('phone is required');

    // ── Authenticate via Supabase session ──
    const supabase      = await createClient();       // anon key — for auth only
    const adminSupabase = await createAdminClient();  // service-role — for DB writes

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      logger.warn('POST /api/auth/register: unauthenticated request');
      return unauthorized('Session expired. Please log in again.');
    }

    const email   = user.email!;
    const picture = (user.user_metadata?.avatar_url as string | undefined) ?? null;

    // ── Check for duplicate (admin client bypasses RLS) ──
    const { data: existing } = await (adminSupabase as any)
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existing) {
      // Already registered — update name/phone and return success
      await (adminSupabase as any)
        .from('users')
        .update({ display_name: name.trim(), phone: phone.trim(), last_login: new Date().toISOString() })
        .eq('email', email);
      return conflict('Email already registered');
    }

    // ── Create user record ──
    const username = email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '').slice(0, 64);

    const { data: newUser, error: insertError } = await (adminSupabase as any)
      .from('users')
      .insert({
        username:      username,
        email:         email,
        password_hash: 'google-oauth',   // no password for OAuth users
        display_name:  name.trim(),
        phone:         phone.trim(),
        avatar_url:    picture,
        last_login:    new Date().toISOString(),
      })
      .select('id, username, display_name, avatar_url, email, created_at')
      .single();

    if (insertError) {
      logger.error('Register: insert error', insertError);
      return serverError(insertError, process.env.NODE_ENV !== 'production');
    }

    // ── Initialise user_standings record ──
    await (adminSupabase as any)
      .from('user_standings')
      .insert({ user_id: newUser.id });

    logger.info(`New user registered: ${email} (id: ${newUser.id})`);
    return created({ user: newUser });
  } catch (err) {
    logger.error('POST /api/auth/register error:', err);
    return serverError(err, process.env.NODE_ENV !== 'production');
  }
}
