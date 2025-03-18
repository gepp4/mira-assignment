import { type InferSelectModel } from "drizzle-orm";
import {
  pgTable,
  serial,
  timestamp,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const playerTable = pgTable("player", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }).notNull(),
  club: varchar("club", { length: 255 }).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  birthDate: timestamp("birth_date", { mode: "date" }).notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

const insertSchema = createInsertSchema(playerTable).omit({
  id: true,
});

export type InsertPlayer = z.infer<typeof insertSchema>;
export type SelectPlayer = InferSelectModel<typeof playerTable>;
