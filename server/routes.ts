import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPersonSchema, insertRatingSchema, insertCommentSchema, insertFacemashVoteSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all people
  app.get("/api/people", async (req, res) => {
    try {
      const category = req.query.category as string;
      const people = category && category !== "الكل" 
        ? await storage.getPeopleByCategory(category)
        : await storage.getAllPeople();
      res.json(people);
    } catch (error) {
      res.status(500).json({ message: "Error fetching people" });
    }
  });

  // Get person by ID
  app.get("/api/people/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const person = await storage.getPersonById(id);
      if (!person) {
        return res.status(404).json({ message: "Person not found" });
      }
      res.json(person);
    } catch (error) {
      res.status(500).json({ message: "Error fetching person" });
    }
  });

  // Create new person
  app.post("/api/people", async (req, res) => {
    try {
      const validatedData = insertPersonSchema.parse(req.body);
      const person = await storage.createPerson(validatedData);
      res.status(201).json(person);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error creating person" });
      }
    }
  });

  // Get top rated people
  app.get("/api/people/top/:limit", async (req, res) => {
    try {
      const limit = parseInt(req.params.limit) || 3;
      const topPeople = await storage.getTopRatedPeople(limit);
      res.json(topPeople);
    } catch (error) {
      res.status(500).json({ message: "Error fetching top people" });
    }
  });

  // Add rating
  app.post("/api/ratings", async (req, res) => {
    try {
      const validatedData = insertRatingSchema.parse(req.body);
      const rating = await storage.createRating(validatedData);
      res.status(201).json(rating);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error creating rating" });
      }
    }
  });

  // Get comments for person
  app.get("/api/people/:id/comments", async (req, res) => {
    try {
      const personId = parseInt(req.params.id);
      const comments = await storage.getCommentsByPersonId(personId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Error fetching comments" });
    }
  });

  // Add comment
  app.post("/api/comments", async (req, res) => {
    try {
      const validatedData = insertCommentSchema.parse(req.body);
      const comment = await storage.createComment(validatedData);
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error creating comment" });
      }
    }
  });

  // Get random people for FaceMash
  app.get("/api/facemash/random", async (req, res) => {
    try {
      const randomPeople = await storage.getRandomPeopleForComparison();
      if (!randomPeople) {
        return res.status(404).json({ message: "Not enough people for comparison" });
      }
      res.json(randomPeople);
    } catch (error) {
      res.status(500).json({ message: "Error fetching random people" });
    }
  });

  // Submit FaceMash vote
  app.post("/api/facemash/vote", async (req, res) => {
    try {
      const validatedData = insertFacemashVoteSchema.parse(req.body);
      const vote = await storage.createFacemashVote(validatedData);
      res.status(201).json(vote);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error creating vote" });
      }
    }
  });

  // Get FaceMash leaderboard
  app.get("/api/facemash/leaderboard", async (req, res) => {
    try {
      const leaderboard = await storage.getFacemashLeaderboard();
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ message: "Error fetching leaderboard" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
