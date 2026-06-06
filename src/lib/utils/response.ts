/**
 * MUNDIAL — Standardized API Response Helpers
 * Use Response.json() (Web API) — compatible with Next.js Route Handlers.
 */

export interface ApiSuccess<T = unknown> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: string;
  errors?: { field: string; message: string }[];
}

/** 200 OK — with data payload */
export function ok<T>(data: T, status = 200): Response {
  return Response.json({ success: true, data } satisfies ApiSuccess<T>, { status });
}

/** 201 Created */
export function created<T>(data: T): Response {
  return ok(data, 201);
}

/** 204 No Content */
export function noContent(): Response {
  return new Response(null, { status: 204 });
}

/** 400 Bad Request */
export function badRequest(error: string, errors?: ApiError['errors']): Response {
  return Response.json(
    { success: false, error, ...(errors ? { errors } : {}) } satisfies ApiError,
    { status: 400 },
  );
}

/** 401 Unauthorized */
export function unauthorized(error = 'Authentication required'): Response {
  return Response.json({ success: false, error } satisfies ApiError, { status: 401 });
}

/** 403 Forbidden */
export function forbidden(error = 'Access denied'): Response {
  return Response.json({ success: false, error } satisfies ApiError, { status: 403 });
}

/** 404 Not Found */
export function notFound(error = 'Resource not found'): Response {
  return Response.json({ success: false, error } satisfies ApiError, { status: 404 });
}

/** 409 Conflict */
export function conflict(error = 'Resource already exists'): Response {
  return Response.json({ success: false, error } satisfies ApiError, { status: 409 });
}

/** 500 Internal Server Error */
export function serverError(error: unknown, isDev = false): Response {
  const message = isDev && error instanceof Error ? error.message : 'Internal server error';
  return Response.json({ success: false, error: message } satisfies ApiError, { status: 500 });
}
