import { env } from '@/env';
import { defineConfig } from 'drizzle-kit';
// import { user, account, session, verification } from './auth-schema';

export default defineConfig({
  dialect: 'postgresql', // 'mysql' | 'sqlite' | 'turso'
  schema: './src/db/schema',
  out: './migrations',
  dbCredentials: {
    url: env.DATABASE_URL
  }
});
