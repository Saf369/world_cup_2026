/**
 * GET /api/health
 * Public health check — no auth required.
 */

export const dynamic = 'force-dynamic';

export async function GET(): Promise<Response> {
  return Response.json({
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'MUNDIAL API',
    },
  });
}
