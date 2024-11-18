import {
  pgTable,
  uuid,
  varchar,
  text,
  decimal,
  date,
  integer,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  user_id: uuid("user_id").primaryKey().defaultRandom(),
  password: varchar("password", { length: 255 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  address: text("address"),
  role: varchar("role", { length: 10 }).default("user"),
});

export const childrensHomes = pgTable("childrens_homes", {
  home_id: uuid("home_id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  location: varchar("location", { length: 255 }),
  description: text("description"),
  contact_information: text("contact_information"),
  needs: text("needs"),
});

export const donations = pgTable("donations", {
  donation_id: uuid("donation_id").primaryKey().defaultRandom(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  donation_date: date("donation_date").notNull(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => users.user_id, { onDelete: "cascade" }),
  home_id: uuid("home_id").references(() => childrensHomes.home_id, {
    onDelete: "set null",
  }),
});

export const visits = pgTable("visits", {
  visit_id: uuid("visit_id").primaryKey().defaultRandom(),
  visit_date: date("visit_date").notNull(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => users.user_id, { onDelete: "cascade" }),
  home_id: uuid("home_id").references(() => childrensHomes.home_id, {
    onDelete: "set null",
  }),
});

export const reviews = pgTable("reviews", {
  review_id: uuid("review_id").primaryKey().defaultRandom(),
  rating: integer("rating"),
  comment: text("comment"),
  user_id: uuid("user_id")
    .notNull()
    .references(() => users.user_id, { onDelete: "cascade" }),
  home_id: uuid("home_id").references(() => childrensHomes.home_id, {
    onDelete: "set null",
  }),
});
