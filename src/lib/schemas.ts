/**
 * MUNDIAL — Zod Validation Schemas
 * All API request bodies defined in one place.
 */

import { z } from 'zod';

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  idToken:      z.string().min(10, 'Invalid Google token'),
});

export const registerSchema = z.object({
  idToken:      z.string().min(10, 'Invalid Google token'),
  name:         z.string().min(2).max(128),
  phone:        z.string().min(7).max(15),
  favoriteTeam: z.string().max(64).optional().nullable(),
  displayName:  z.string().max(128).optional().nullable(),
});

// ─── User Profile ─────────────────────────────────────────────────────────────

export const updateProfileSchema = z.object({
  name:         z.string().min(2).max(128).optional(),
  displayName:  z.string().max(128).optional().nullable(),
  favoriteTeam: z.string().max(64).optional().nullable(),
  avatarUrl:    z.string().url().optional().nullable(),
});

// ─── Predictions ──────────────────────────────────────────────────────────────

export const groupPredictionSchema = z.object({
  groupMatchId:       z.number().int().positive(),
  predictedHomeScore: z.number().int().min(0).max(20),
  predictedAwayScore: z.number().int().min(0).max(20),
  confidenceLevel:    z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
});

export const confirmGroupSchema = z.object({
  groupLetter: z.string().length(1).transform((s) => s.toUpperCase()),
});

export const knockoutPredictionSchema = z.object({
  knockoutMatchId:    z.number().int().positive(),
  predictedWinnerId:  z.number().int().positive(),
  predictedScoreH:    z.number().int().min(0).max(20).optional().nullable(),
  predictedScoreA:    z.number().int().min(0).max(20).optional().nullable(),
  confidenceLevel:    z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  topScorer:          z.string().max(128).optional().nullable(),
});

// ─── Types inferred from schemas ──────────────────────────────────────────────

export type LoginInput         = z.infer<typeof loginSchema>;
export type RegisterInput      = z.infer<typeof registerSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type GroupPredInput     = z.infer<typeof groupPredictionSchema>;
export type ConfirmGroupInput  = z.infer<typeof confirmGroupSchema>;
export type KOPredInput        = z.infer<typeof knockoutPredictionSchema>;
