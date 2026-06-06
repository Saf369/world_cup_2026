/**
 * POST /api/auth/login
 * Exchange a Google ID token for a Supabase session.
 * If the user doesn't exist yet, returns { isNewUser: true } so the
 * frontend can redirect to the registration form.
 */

import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { validate } from '@/lib/middleware/withValidation';
import { loginSchema } from '@/lib/schemas';
import { ok, serverError } from '@/lib/utils/response';
import { OAuth2Client } from 'google-auth-library';
import logger from '@/lib/utils/logger';

export const dynamic = 'force-dynamic';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function verifyGoogleToken(idToken: string) {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  if (!payload) throw new Error('Invalid Google token payload');
  return {
    googleId: payload.sub,
    email:    payload.email!,
    name:     payload.name ?? '',
    picture:  payload.picture ?? null,
  };
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json().catch(() => ({}));
    const v = validate(loginSchema, body);
    if (!v.ok) return v.error;

    const googleUser = await verifyGoogleToken(v.data.idToken);
    const supabase   = await createClient();

    // Check if user already exists in our users table
    const { data: existingUser } = await (supabase as any)
      .from('users')
      .select('id, username, display_name, avatar_url, preferred_team')
      .eq('email', googleUser.email)
      .eq('is_active', true)
      .single();

    if (!existingUser) {
      // New user — tell the frontend to show the registration form
      return ok({ isNewUser: true, googleUser });
    }

    // Sign in via Supabase Auth (magic link / OAuth handled externally)
    // Update last_login
    await (supabase as any)
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', existingUser.id);

    logger.info(`User logged in: ${googleUser.email}`);
    return ok({ isNewUser: false, user: existingUser });
  } catch (err) {
    logger.error('POST /api/auth/login error:', err);
    return serverError(err, process.env.NODE_ENV !== 'production');
  }
}
