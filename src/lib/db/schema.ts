import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
    id: text("id").notNull().primaryKey(),
    username: text("username").notNull().unique(),
    avatar: text("avatar"),
    hashedPassword: text("hashedPassword"),
    role: text("role", { enum: ["user", "admin"] })
        .notNull()
        .default("user"),
    createdAt: text("created_at")
        .notNull()
        .default(sql`(current_timestamp)`),
});

export const sessions = sqliteTable("sessions", {
    id: text("id").notNull().primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: integer("expires_at").notNull(),
});

export type User = typeof users.$inferSelect;
