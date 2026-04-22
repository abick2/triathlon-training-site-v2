import { neon } from '@neondatabase/serverless';

export function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('Missing DATABASE_URL env var. Add it to .env.local.');
  return neon(url);
}
