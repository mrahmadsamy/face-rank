CREATE TABLE "comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"person_id" integer NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "facemash_votes" (
	"id" serial PRIMARY KEY NOT NULL,
	"winner_id" integer NOT NULL,
	"loser_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "people" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"image_url" text NOT NULL,
	"average_rating" real DEFAULT 0,
	"rating_count" integer DEFAULT 0,
	"comments_count" integer DEFAULT 0,
	"facemash_wins" integer DEFAULT 0,
	"facemash_losses" integer DEFAULT 0,
	"view_count" integer DEFAULT 0,
	"is_verified" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ratings" (
	"id" serial PRIMARY KEY NOT NULL,
	"person_id" integer NOT NULL,
	"rating" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
