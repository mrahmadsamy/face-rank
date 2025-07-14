import { pgTable, text, serial, integer, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const people = pgTable("people", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  averageRating: real("average_rating").default(0),
  ratingCount: integer("rating_count").default(0),
  commentsCount: integer("comments_count").default(0),
  facemashWins: integer("facemash_wins").default(0),
  facemashLosses: integer("facemash_losses").default(0),
  viewCount: integer("view_count").default(0),
  isVerified: integer("is_verified").default(0), // For verified accounts
  createdAt: timestamp("created_at").defaultNow(),
});

export const ratings = pgTable("ratings", {
  id: serial("id").primaryKey(),
  personId: integer("person_id").notNull(),
  rating: integer("rating").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  personId: integer("person_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const facemashVotes = pgTable("facemash_votes", {
  id: serial("id").primaryKey(),
  winnerId: integer("winner_id").notNull(),
  loserId: integer("loser_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPersonSchema = createInsertSchema(people).omit({
  id: true,
  averageRating: true,
  ratingCount: true,
  commentsCount: true,
  facemashWins: true,
  facemashLosses: true,
  viewCount: true,
  isVerified: true,
  createdAt: true,
});

export const insertRatingSchema = createInsertSchema(ratings).omit({
  id: true,
  createdAt: true,
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
});

export const insertFacemashVoteSchema = createInsertSchema(facemashVotes).omit({
  id: true,
  createdAt: true,
});

export type Person = typeof people.$inferSelect;
export type InsertPerson = z.infer<typeof insertPersonSchema>;
export type Rating = typeof ratings.$inferSelect;
export type InsertRating = z.infer<typeof insertRatingSchema>;
export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type FacemashVote = typeof facemashVotes.$inferSelect;
export type InsertFacemashVote = z.infer<typeof insertFacemashVoteSchema>;
