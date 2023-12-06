import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const user = pgTable("users", {
	id: text("id").primaryKey().unique(),
	email: text("email").unique().notNull(),
	stripeCustomerId: text("stripe_customer_id").unique(),
	stripeSubscriptionId: text("stripe_subscription_id").unique(),
	stripePriceId: text("stripe_price_id"),
	stripeCurrentPeriodEnd: timestamp("stripe_current_period_end"),
});
