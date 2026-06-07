/**
 * XI — Zod Validation Helper for Route Handlers
 * Usage:
 *   const result = validate(groupPredictionSchema, await req.json());
 *   if (!result.ok) return result.error;   // returns a 400 Response
 *   const data = result.data;
 */

import { ZodSchema } from 'zod';
import type { ZodIssue } from 'zod';
import { badRequest } from '@/lib/utils/response';

type ValidateOk<T>  = { ok: true;  data: T };
type ValidateFail   = { ok: false; error: Response };
type ValidateResult<T> = ValidateOk<T> | ValidateFail;

export function validate<T>(schema: ZodSchema<T>, input: unknown): ValidateResult<T> {
  const result = schema.safeParse(input);

  if (!result.success) {
    const errors = result.error.issues.map((e: ZodIssue) => ({
      field:   e.path.join('.'),
      message: e.message,
    }));
    return { ok: false, error: badRequest('Validation failed', errors) };
  }

  return { ok: true, data: result.data };
}

