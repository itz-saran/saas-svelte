import { relations } from "drizzle-orm";
import { boolean, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// ? Declaring enums at top so it gets generated at first before tables
export const UPLOAD_STATUS = pgEnum("upload_status", [
	"PENDING",
	"PROCESSING",
	"FAILED",
	"SUCCESS",
]);

export const user = pgTable("users", {
	id: text("id").primaryKey().unique(),
	email: text("email").unique().notNull(),
	stripeCustomerId: text("stripe_customer_id").unique(),
	stripeSubscriptionId: text("stripe_subscription_id").unique(),
	stripePriceId: text("stripe_price_id"),
	stripeCurrentPeriodEnd: timestamp("stripe_current_period_end", { withTimezone: true }),
});

export const userRelations = relations(user, ({ many }) => ({
	// ? One user may upload many files
	files: many(file),
	// ? One user may have many messages
	messages: many(message),
}));

export const file = pgTable("files", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: text("name").notNull(),
	uploadStatus: UPLOAD_STATUS("upload_status").default("PENDING").notNull(),
	url: text("url").notNull(),
	key: text("string").unique().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
	userId: text("user_id").notNull(),
});

export const fileRelations = relations(file, ({ one, many }) => ({
	// ? Many files have one author
	user: one(user, {
		fields: [file.userId],
		references: [user.id],
	}),
	// ? One file may have many messages
	messages: many(message),
}));

export const message = pgTable("messages", {
	id: uuid("id").defaultRandom().primaryKey(),
	text: text("text").notNull(),
	isUserMessage: boolean("is_user_message"),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
	fileId: text("file_id").notNull(),
	userId: text("user_id").notNull(),
});

export const messageRelations = relations(message, ({ one }) => ({
	// ? Message has one user and file
	user: one(user, {
		fields: [message.userId],
		references: [user.id],
	}),

	file: one(file, {
		fields: [message.fileId],
		references: [file.key],
	}),
}));
