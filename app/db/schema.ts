import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";
import { db } from ".";

export const userTable = sqliteTable("users", {
	id: text("id")
		.$defaultFn(() => nanoid())
		.primaryKey(),
	email: text("email").unique().notNull(),
	password: text("password").notNull(),
	createdAt: integer("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
	updateAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
		() => new Date(),
	),
});

export const coordinateTable = sqliteTable("coordinates", {
	id: text("id")
		.$defaultFn(() => nanoid())
		.primaryKey(),
	userId: text("userId").notNull(),
	x: integer("x").notNull(),
	y: integer("y").notNull(),
	src: text("src").notNull(),
});

export const userRelations = relations(userTable, ({ one }) => ({
	coordinates: one(coordinateTable),
}));

export type InsertUser = typeof userTable.$inferInsert;
export type SelectUser = typeof userTable.$inferSelect;