import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

// autnentication tables
export const account = pgTable(
  "account",
  {
    id: varchar("id", { length: 191 }).primaryKey().notNull(),
    userId: varchar("userId", { length: 191 }).notNull(),
    type: varchar("type", { length: 191 }).notNull(),
    provider: varchar("provider", { length: 191 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 191 }).notNull(),
    access_token: text("access_token"),
    expires_in: integer("expires_in"),
    id_token: text("id_token"),
    refresh_token: text("refresh_token"),
    refresh_token_expires_in: integer("refresh_token_expires_in"),
    scope: varchar("scope", { length: 191 }),
    token_type: varchar("token_type", { length: 191 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  (account) => ({
    providerProviderAccountIdIndex: uniqueIndex(
      "account__provider__providerAccountId__idx"
    ).on(account.provider, account.providerAccountId),
    userIdIndex: index("account__userId__idx").on(account.userId),
  })
);

export const session = pgTable(
  "session",
  {
    id: varchar("id", { length: 191 }).primaryKey().notNull(),
    sessionToken: varchar("sessionToken", { length: 191 }).notNull(),
    userId: varchar("userId", { length: 191 }).notNull(),
    expires: timestamp("expires").notNull(),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
  },
  (session) => ({
    sessionTokenIndex: uniqueIndex("session__sessionToken__idx").on(
      session.sessionToken
    ),
    userIdIndex: index("session__userId__idx").on(session.userId),
  })
);

export const user = pgTable(
  "user",
  {
    id: varchar("id", { length: 191 }).primaryKey().notNull(),
    name: varchar("name", { length: 191 }),
    email: varchar("email", { length: 191 }).notNull(),
    emailVerified: timestamp("emailVerified"),
    image: varchar("image", { length: 191 }),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  (user) => ({
    emailIndex: uniqueIndex("user__email__idx").on(user.email),
  })
);

// export const userRelation = pgTable("")

export const verificationToken = pgTable(
  "verification_token",
  {
    identifier: varchar("identifier", { length: 191 }).primaryKey().notNull(),
    token: varchar("token", { length: 191 }).notNull(),
    expires: timestamp("expires").notNull(),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  (verificationToken) => ({
    tokenIndex: uniqueIndex("verification_token__token__idx").on(
      verificationToken.token
    ),
  })
);

export const resetPasswordToken = pgTable("ResetPasswordToken", {
  id: varchar("id", { length: 191 }).primaryKey().notNull(),
  expires: timestamp("expires", { precision: 3, mode: "string" }).notNull(),
  email: text("email").notNull(),
});

export const passkey = pgTable("Passkey", {
  id: varchar("id", { length: 191 }).primaryKey().notNull(),
  name: text("name").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
  createdAt: timestamp("createdAt", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
  lastUsed: timestamp("lastUsed", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
  counter: integer("counter").notNull(),
  credentialId: text("credentialID").notNull(),
  credentialPublicKey: text("credentialPublicKey").notNull(),
  transports: text("transports").array(),
});