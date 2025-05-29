import { InferSelectModel, relations } from 'drizzle-orm';
import {
  pgTable,
  text,
  timestamp,
  boolean,
  pgEnum,
  uuid
} from 'drizzle-orm/pg-core';

export const providerEnum = pgEnum('provider_enum_social', [
  'google',
  'facebook',
  'credentials'
]);
export const roleEnum = pgEnum('user_role', ['customer', 'dealer', 'admin']);

const timestamps = {
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
};

export const userTable = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull(),
  provider: providerEnum().default('credentials').notNull(),
  providerId: text('provider_id').notNull(),
  image: text('image'),
  role: roleEnum().default('customer').notNull(),
  ...timestamps
});

export type UserType = InferSelectModel<typeof userTable>;

export const usersRelations = relations(userTable, ({ many }) => ({
  session: many(sessionTable)
}));

export const sessionTable = pgTable('sessions', {
  id: text('id').primaryKey(), // crypto will create encrypted id while session creation
  expiresAt: timestamp('expires_at', {
    mode: 'date',
    withTimezone: true
  }).notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: uuid('user_id')
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
  ...timestamps
});
export type SessionType = InferSelectModel<typeof sessionTable>;

export const sessionsRelations = relations(sessionTable, ({ one }) => ({
  user: one(userTable, {
    fields: [sessionTable.userId],
    references: [userTable.id]
  })
}));

// export const account = pgTable('account', {
//   id: text('id').primaryKey(),
//   accountId: text('account_id').notNull(),
//   providerId: text('provider_id').notNull(),
//   userId: text('user_id')
//     .notNull()
//     .references(() => user.id, { onDelete: 'cascade' }),
//   accessToken: text('access_token'),
//   refreshToken: text('refresh_token'),
//   idToken: text('id_token'),
//   accessTokenExpiresAt: timestamp('access_token_expires_at'),
//   refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
//   scope: text('scope'),
//   password: text('password'),
//   createdAt: timestamp('created_at').notNull(),
//   updatedAt: timestamp('updated_at').notNull()
// });

// export const verification = pgTable('verification', {
//   id: text('id').primaryKey(),
//   identifier: text('identifier').notNull(),
//   value: text('value').notNull(),
//   expiresAt: timestamp('expires_at').notNull(),
//   createdAt: timestamp('created_at'),
//   updatedAt: timestamp('updated_at')
// });
