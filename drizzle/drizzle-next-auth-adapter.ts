import { createId } from "@paralleldrive/cuid2";
import { and, eq } from "drizzle-orm";
import { NeonHttpDatabase } from "drizzle-orm/neon-http";
import type { Adapter } from "next-auth/adapters";

import { account, session, user, verificationToken } from "./auth_schema";

export function DrizzleAdapter(db: NeonHttpDatabase): Adapter {
  return {
    async createUser(userData) {
      await db.insert(user).values({
        id: createId(),
        email: userData.email,
        emailVerified: userData.emailVerified,
        name: userData.name,
        image: userData.image,
      });
      const rows = await db
        .select()
        .from(user)
        .where(eq(user.email, userData.email))
        .limit(1);
      const row = rows[0];
      if (!row) throw new Error("User not found");
      return row;
    },
    async getUser(id) {
      const rows = await db
        .select()
        .from(user)
        .where(eq(user.id, id))
        .limit(1);
      const row = rows[0];
      return row ?? null;
    },
    async getUserByEmail(email) {
      const rows = await db
        .select()
        .from(user)
        .where(eq(user.email, email))
        .limit(1);
      const row = rows[0];
      return row ?? null;
    },
    async getUserByAccount({ providerAccountId, provider }) {
      const rows = await db
        .select()
        .from(user)
        .innerJoin(account, eq(user.id, account.userId))
        .where(
          and(
            eq(account.providerAccountId, providerAccountId),
            eq(account.provider, provider)
          )
        )
        .limit(1);
      const row = rows[0];
      return row?.users ?? null;
    },
    async updateUser({ id, ...userData }) {
      if (!id) throw new Error("User not found");
      await db.update(user).set(userData).where(eq(user.id, id));
      const rows = await db
        .select()
        .from(user)
        .where(eq(user.id, id))
        .limit(1);
      const row = rows[0];
      if (!row) throw new Error("User not found");
      return row;
    },
    async deleteUser(userId) {
      await db.delete(user).where(eq(user.id, userId));
    },
    async linkAccount(account) {
      await db.insert(account).values({
        id: createId(),
        userId: account.userId,
        type: account.type,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        access_token: account.access_token,
        expires_in: account.expires_in as number,
        id_token: account.id_token,
        refresh_token: account.refresh_token,
        refresh_token_expires_in: account.refresh_token_expires_in as number,
        scope: account.scope,
        token_type: account.token_type,
      });
    },
    async unlinkAccount({ providerAccountId, provider }) {
      await db
        .delete(account)
        .where(
          and(
            eq(account.providerAccountId, providerAccountId),
            eq(account.provider, provider)
          )
        );
    },
    async createSession(data) {
      await db.insert(session).values({
        id: createId(),
        expires: data.expires,
        sessionToken: data.sessionToken,
        userId: data.userId,
      });
      const rows = await db
        .select()
        .from(session)
        .where(eq(session.sessionToken, data.sessionToken))
        .limit(1);
      const row = rows[0];
      if (!row) throw new Error("User not found");
      return row;
    },
    async getSessionAndUser(sessionToken) {
      const rows = await db
        .select({
          user: user,
          session: {
            id: session.id,
            userId: session.userId,
            sessionToken: session.sessionToken,
            expires: session.expires,
          },
        })
        .from(session)
        .innerJoin(user, eq(user.id, session.userId))
        .where(eq(session.sessionToken, sessionToken))
        .limit(1);
      const row = rows[0];
      if (!row) return null;
      const { user, session } = row;
      return {
        user,
        session: {
          id: session.id,
          userId: session.userId,
          sessionToken: session.sessionToken,
          expires: session.expires,
        },
      };
    },
    async updateSession(session) {
      await db
        .update(session)
        .set(session)
        .where(eq(session.sessionToken, session.sessionToken));
      const rows = await db
        .select()
        .from(session)
        .where(eq(session.sessionToken, session.sessionToken))
        .limit(1);
      const row = rows[0];
      if (!row) throw new Error("Coding bug: updated session not found");
      return row;
    },
    async deleteSession(sessionToken) {
      await db.delete(session).where(eq(session.sessionToken, sessionToken));
    },
    async createVerificationToken(verificationToken) {
      await db.insert(verificationToken).values({
        expires: verificationToken.expires,
        identifier: verificationToken.identifier,
        token: verificationToken.token,
      });
      const rows = await db
        .select()
        .from(verificationToken)
        .where(eq(verificationToken.token, verificationToken.token))
        .limit(1);
      const row = rows[0];
      if (!row)
        throw new Error("Coding bug: inserted verification token not found");
      return row;
    },
    async useVerificationToken({ identifier, token }) {
      const rows = await db
        .select()
        .from(verificationToken)
        .where(eq(verificationToken.token, token))
        .limit(1);
      const row = rows[0];
      if (!row) return null;
      await db
        .delete(verificationToken)
        .where(
          and(
            eq(verificationToken.token, token),
            eq(verificationToken.identifier, identifier)
          )
        );
      return row;
    },
  };
}
