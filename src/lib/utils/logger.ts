/**
 * XI — Winston Logger
 * Server-only — do NOT import in 'use client' components.
 * Logs to console in dev, to file in production.
 */

import winston from 'winston';

const { combine, timestamp, colorize, printf, json, errors } = winston.format;

const isDev = process.env.NODE_ENV !== 'production';

const devFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ level, message, timestamp, stack }) =>
    stack
      ? `${timestamp} [${level}] ${message}\n${stack}`
      : `${timestamp} [${level}] ${message}`,
  ),
);

const prodFormat = combine(
  timestamp(),
  errors({ stack: true }),
  json(),
);

const transports: winston.transport[] = [
  new winston.transports.Console({ silent: false }),
];

// Vercel serverless functions have a read-only filesystem (except /tmp).
// We rely entirely on the Console transport, which Vercel captures automatically.
// Do not attempt to write to 'logs/'.

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL ?? (isDev ? 'debug' : 'info'),
  format: isDev ? devFormat : prodFormat,
  transports,
  exitOnError: false,
});

export default logger;
