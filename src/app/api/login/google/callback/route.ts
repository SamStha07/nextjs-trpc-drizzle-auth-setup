import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

import { db } from '@/db';
import { userTable } from '@/db/schema/auth-schema';
import { google } from '@/lib/providers';
import { setSession } from '@/lib/auth';

export interface GoogleUser {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
}

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const cookieStore = await cookies();
  const storedState = cookieStore.get('google_oauth_state')?.value ?? null;
  const codeVerifier = cookieStore.get('google_code_verifier')?.value ?? null;
  const redirectUrl = cookieStore.get('redirect_path')?.value ?? '/';

  if (
    code === null ||
    state === null ||
    storedState === null ||
    codeVerifier === null
  ) {
    return new Response(null, {
      status: 400
    });
  }
  if (state !== storedState) {
    return new Response(null, {
      status: 400
    });
  }

  let googleUser: GoogleUser;
  try {
    const tokens = await google.validateAuthorizationCode(code, codeVerifier);

    const response = await fetch(
      'https://openidconnect.googleapis.com/v1/userinfo',
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken()}`
        }
      }
    );
    googleUser = await response.json();
  } catch (e) {
    console.error('🚀 ~ GET ~ e:', e);
    // Invalid code or client credentials
    return new Response(null, {
      status: 400
    });
  }

  const existingUser = await db
    .select()
    .from(userTable)
    .where(eq(userTable.providerId, googleUser.sub));

  if (existingUser.length > 0) {
    await setSession(existingUser[0].id);

    return new Response(null, {
      status: 302,
      headers: {
        Location: redirectUrl
      }
    });
  }

  // User doesn't exist, create a new one
  const { email, email_verified, name, picture, sub } = googleUser;
  const user = await db
    .insert(userTable)
    .values({
      name,
      email,
      providerId: sub,
      provider: 'google',
      emailVerified: email_verified,
      image: picture
    })
    .returning();

  await setSession(user[0].id);

  return new Response(null, {
    status: 302,
    headers: {
      Location: redirectUrl
    }
  });
}
