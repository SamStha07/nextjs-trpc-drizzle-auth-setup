import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';

import { SESSION_COOKIE_NAME } from '@/constants';

import { setSessionTokenCookie } from './cookies';
import {
  createSession,
  generateSessionToken,
  SessionValidationResult,
  validateSessionToken
} from './session';

export async function validateRequest(): Promise<SessionValidationResult> {
  const sessionToken = await getSessionToken();
  if (!sessionToken) {
    return { session: null, user: null };
  }
  return validateSessionToken(sessionToken);
}

export async function getSessionToken(): Promise<string | undefined> {
  const allCookies = await cookies();
  const sessionCookie = allCookies.get(SESSION_COOKIE_NAME)?.value;
  return sessionCookie;
}

export const getCurrentUser = cache(async () => {
  const { user } = await validateRequest();
  return user ?? undefined;
});

export const checkAuth = async () => {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }
  return user;
};

export async function setSession(userId: string) {
  const token = generateSessionToken();
  const session = await createSession(token, userId);
  await setSessionTokenCookie(token, session.expiresAt);
}

export async function checkIsAdmin() {
  const user = await checkAuth();

  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'admin') {
    redirect('/');
  }
}

export async function checkIsDealer() {
  const user = await checkAuth();

  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'dealer') {
    redirect('/');
  }
}

export async function checkIsPublic() {
  const user = await checkAuth();

  if (user) {
    redirect('/');
  }
}
