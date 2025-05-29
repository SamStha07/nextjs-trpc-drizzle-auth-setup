import { generateState, generateCodeVerifier } from 'arctic';
import { cookies } from 'next/headers';

import { google } from '@/lib/providers';

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const redirectPath = searchParams.get('redirect');

  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const url = google.createAuthorizationURL(state, codeVerifier, [
    'openid',
    'profile',
    'email'
  ]);

  const cookieStore = await cookies();
  cookieStore.set('google_oauth_state', state, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 10, // 10 minutes
    sameSite: 'lax'
  });
  cookieStore.set('google_code_verifier', codeVerifier, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 10, // 10 minutes
    sameSite: 'lax'
  });
  if (redirectPath) {
    // Store redirect path in cookie
    cookieStore.set('redirect_path', redirectPath, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 10, // 10 minutes
      sameSite: 'lax'
    });
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: url.toString()
    }
  });
}
