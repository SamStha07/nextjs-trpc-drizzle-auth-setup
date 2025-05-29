import { sha256 } from '@oslojs/crypto/sha2';
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase
} from '@oslojs/encoding';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';

import {
  SESSION_MAX_DURATION_MS,
  SESSION_REFRESH_INTERVAL_MS
} from '@/constants';
import { db } from '@/db';
import {
  sessionTable,
  userTable,
  type SessionType,
  type UserType
} from '@/db/schema/auth-schema';

export type SessionValidationResult =
  | { session: SessionType; user: UserType }
  | { session: null; user: null };

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

export async function createSession(
  token: string,
  userId: string
): Promise<SessionType> {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || null;

  const forwardedFor =
    headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || null;
  const ipAddress = forwardedFor
    ? forwardedFor.includes(',')
      ? forwardedFor.split(',')[0].trim()
      : forwardedFor.trim()
    : null;

  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  // check if already there is a session of that specific user or not
  const checkSession = await db
    .select()
    .from(userTable)
    .innerJoin(sessionTable, eq(sessionTable.userId, userTable.id))
    .where(eq(userTable.id, userId));

  if (checkSession.length >= 1) {
    const session = await db
      .update(sessionTable)
      .set({
        id: sessionId,
        userId,
        ipAddress,
        userAgent,
        expiresAt: new Date(Date.now() + SESSION_MAX_DURATION_MS)
      })
      .where(eq(sessionTable.id, checkSession[0].sessions.id))
      .returning();

    return session[0];
  }

  // for new user
  const session = await db
    .insert(sessionTable)
    .values({
      id: sessionId,
      userId,
      ipAddress,
      userAgent,
      expiresAt: new Date(Date.now() + SESSION_MAX_DURATION_MS)
    })
    .returning();

  return session[0];
}

export async function validateSessionToken(
  token: string
): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  const result = await db
    .select()
    .from(sessionTable)
    .innerJoin(userTable, eq(sessionTable.userId, userTable.id))
    .where(eq(sessionTable.id, sessionId));

  if (result.length < 1) {
    return { session: null, user: null };
  }

  const { users: user, sessions: session } = result[0];

  // if current time is greater than expiry time then logged out
  if (Date.now() >= session.expiresAt.getTime()) {
    await db.delete(sessionTable).where(eq(sessionTable.id, session.id));
    return { session: null, user: null };
  }

  // Check if the session is about to expire in the next 15 days
  if (Date.now() >= session.expiresAt.getTime() - SESSION_REFRESH_INTERVAL_MS) {
    session.expiresAt = new Date(Date.now() + SESSION_MAX_DURATION_MS);
    await db
      .update(sessionTable)
      .set({
        expiresAt: session.expiresAt
      })
      .where(eq(sessionTable.id, session.id));
  }

  return { session, user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
}

export async function invalidateAllSessions(userId: string): Promise<void> {
  await db.delete(sessionTable).where(eq(sessionTable.userId, userId));
}

// console.log('token expired regenerating');

// const response = await fetch(
//   `${env.NEXT_PUBLIC_APP_URL}/api/login/update-session`,
//   {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//       oldSessionId: session.id
//     })
//   }
// );
// const data = await response.json();
// return { session: data, user };
