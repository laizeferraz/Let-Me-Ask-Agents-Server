/** biome-ignore-all lint/style/noNonNullAssertion: the expression is needed for clarity */
import { z } from 'zod';

const envSchema = z
  .object({
    PORT: z.coerce.number().default(3333),
    NODE_ENV: z.string().default('development'),
    // Make both database URLs optional since we'll use one or the other
    DB_URL: z.string().url().startsWith('postgresql://').optional(),
    DATABASE_URL: z.string().url().startsWith('postgresql://').optional(),
    GEMINI_API_KEY: z.string(),
  })
  .refine(
    // Ensure at least one database URL is provided
    (data) => data.DB_URL || data.DATABASE_URL,
    {
      message: 'Either DB_URL or DATABASE_URL must be provided',
      path: ['DATABASE_URL'],
    }
  );

export const env = envSchema.parse(process.env);

// Export the final env object with database URL selection logic
export const envProd = {
  PORT: env.PORT,
  NODE_ENV: env.NODE_ENV,
  // Use DATABASE_URL for production, DB_URL for local development
  DATABASE_URL:
    env.NODE_ENV === 'production'
      ? env.DATABASE_URL!
      : env.DB_URL || env.DATABASE_URL!,
  GEMINI_API_KEY: env.GEMINI_API_KEY,
};
