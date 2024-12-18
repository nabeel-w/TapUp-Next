import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  serial,
  numeric,
  bigint,
  varchar,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "@auth/core/adapters";

export const users = pgTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export const apiKeys = pgTable("apiKeys",
  {
    apiKey: text("apiKey").notNull().unique(),
    name: text("name").notNull(),
    createdAt: timestamp("createdAt", { mode: "date" }).notNull(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

  },
  (vt) => ({
    compundKey: primaryKey({ columns: [vt.apiKey, vt.userId] }),
  })
);

export const subscriptions = pgTable('subscriptions', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(), // Subscription name
  price: numeric('price', { precision: 10, scale: 2 }).notNull(), // Price of the subscription
  durationMonths: integer('duration_months').notNull(), // Duration of the subscription in months
  description: text('description'), // Optional description
  storageSize: integer('storage_size').notNull(), //Size in GB
});

export const userSubscriptions = pgTable('user_subscriptions', {
  userId: text('user_id').notNull().references(() => users.id, { onDelete: "cascade" }), // Foreign key to users table
  subscriptionId: serial('subscription_id').notNull().references(() => subscriptions.id, { onDelete: "cascade" }), // Foreign key to subscriptions table
  startDate: timestamp('start_date', { mode: 'date' }).notNull(), // Subscription start date
  endDate: timestamp('end_date', { mode: 'date' }), // Subscription end date (null if ongoing)
  storageUsed: numeric('storage_used').notNull().default('0'), //Size in GB
},
  (vt) => ({
    compundKey: primaryKey({ columns: [vt.userId, vt.subscriptionId] }),
  }));

export const fileMetaData = pgTable('file_metadata', {
  objectId: text('object_id').notNull().unique(),
  name: text('name').notNull(),
  generation: bigint('generation', { mode: 'bigint' }).notNull(),
  metageneration: bigint('metageneration', { mode: 'bigint' }).notNull(),
  contentType: text('contentType').notNull(),
  md5hash: text('md5_hash').notNull(),
  selfLink: text('self_link').notNull(), // Link to the object metadata
  mediaLink: text('media_link').notNull(), // Link to download the object
  timeCreated: timestamp('time_created', { mode: 'string' }).notNull(),
  updated: timestamp('updated', { mode: 'string' }).notNull(),
  size: bigint('size', { mode: 'bigint' }).notNull(),
  ownerId: text('owner_id').notNull().references(() => users.id, { onDelete: "cascade" }),
  permission: varchar('permission', { length: 7 }).notNull().default('private'),
},
  (vt) => ({
    compundKey: primaryKey({ columns: [vt.ownerId, vt.objectId] }),
  })
);

export const fileTags = pgTable('file_tags', {
  objectId: text('object_id').notNull().unique().references(() => fileMetaData.objectId, { onDelete: 'cascade' }),
  ownerId: text('owner_id').notNull().references(() => users.id, { onDelete: "cascade" }),
  tags: text('tags').array().notNull(),
},
  (vt) => ({
    compundKey: primaryKey({ columns: [vt.ownerId, vt.objectId] }),
  })
)