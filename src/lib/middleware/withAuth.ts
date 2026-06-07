/**
 * XI — Auth Middleware for Route Handlers
 * Wraps a Route Handler with Supabase session verification.
 * Usage:
 *   export const GET = withAuth(async (req, ctx, user) => { ... });
 */

import { unauthorized, serverError } from '@/lib/utils/response';
import { createClient } from '@/lib/supabase/server';
import type { NextRequest } from 'next/server';
import type { User } from '@supabase/supabase-js';
import logger from '@/lib/utils/logger';

type HandlerWithUser = (
  req: NextRequest,
  ctx: { params: Promise<Record<string, string>> },
  user: User,
) => Promise<Response>;

export function withAuth(handler: HandlerWithUser) {
  return async (
    req: NextRequest,
    ctx: { params: Promise<Record<string, string>> },
  ): Promise<Response> => {
    try {
      const supabase = await createClient();
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        return unauthorized();
      }

      return handler(req, ctx, user);
    } catch (err) {
      logger.error('withAuth error:', err);
      return serverError(err, process.env.NODE_ENV !== 'production');
    }
  };
}
