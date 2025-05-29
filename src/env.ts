import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    // CLERK_SECRET_KEY:
    //   process.env.NODE_ENV === 'development'
    //     ? z.string().startsWith('sk_test_').min(1)
    //     : z.string().startsWith('sk_test_').min(1),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string()
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url()
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET
  }
  // skipValidation:
  //   !!process.env.SKIP_ENV_VALIDATION ||
  //   !!!!process.env.NEXT_PUBLIC_SKIP_ENV_VALIDATION,

  // For Next.js >= 13.4.4, you only need to destructure client variables:
  // experimental__runtimeEnv: {
  //   NEXT_PUBLIC_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,
  // }
});
