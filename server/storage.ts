import { Person, InsertPerson, Rating, InsertRating, Comment, InsertComment, FacemashVote, InsertFacemashVote, people, ratings, comments, facemashVotes } from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, like, or, and } from "drizzle-orm";

export interface IStorage {
  // People operations
  createPerson(person: InsertPerson): Promise<Person>;
  getAllPeople(): Promise<Person[]>;
  getPeopleByCategory(category: string): Promise<Person[]>;
  getPersonById(id: number): Promise<Person | undefined>;
  updatePersonRating(id: number, averageRating: number, ratingCount: number): Promise<void>;
  getTopRatedPeople(limit: number): Promise<Person[]>;
  
  // Rating operations
  createRating(rating: InsertRating): Promise<Rating>;
  getRatingsByPersonId(personId: number): Promise<Rating[]>;
  
  // Comment operations
  createComment(comment: InsertComment): Promise<Comment>;
  getCommentsByPersonId(personId: number): Promise<Comment[]>;
  updatePersonCommentsCount(personId: number, count: number): Promise<void>;
  
  // FaceMash operations
  createFacemashVote(vote: InsertFacemashVote): Promise<FacemashVote>;
  getFacemashLeaderboard(): Promise<Person[]>;
  getRandomPeopleForComparison(): Promise<[Person, Person] | null>;
  
  // New operations
  incrementViewCount(personId: number): Promise<void>;
  getPersonStats(personId: number): Promise<{ totalVotes: number; winRate: number; } | null>;
  searchPeople(query: string): Promise<Person[]>;
  getSiteStats(): Promise<{
    totalPeople: number;
    totalRatings: number;
    totalComments: number;
    totalFacemashVotes: number;
    avgRating: number;
    topCategory: string;
  }>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    // Initialize sample data on first run
    this.initializeSampleData().catch(console.error);
  }

  private async initializeSampleData() {
    try {
      // Check if data already exists
      const existingPeople = await db.select().from(people).limit(1);
      if (existingPeople.length > 0) {
        return; // Data already initialized
      }

      // Add sample people for demonstration
      const samplePeople = [
        {
          name: "د. محمد الشريف",
          description: "دكتور فيزياء في كلية العلوم - بيشرح كإنه بيحكي حدوتة",
          category: "دكاترة",
          imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"
        },
        {
          name: "أحمد الطالب المجتهد",
          description: "طالب هندسة - دايماً في المكتبة ومبيفهمش حاجة",
          category: "طلبة", 
          imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"
        },
        {
          name: "مريم الموظفة النشيطة",
          description: "موظفة مالية - بتعمل Excel sheets كإنها بتلعب كاندي كراش",
          category: "موظفين",
          imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"
        },
        {
          name: "محمد رمضان الجامعة",
          description: "الشخص اللي كل حد يعرفه - مشهور بس محدش عارف ليه",
          category: "مشاهير",
          imageUrl: "https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"
        }
      ];

      const insertedPeople = [];
      for (const personData of samplePeople) {
        const newPerson = await this.createPerson(personData);
        insertedPeople.push(newPerson);
      }

      // Add sample ratings
      if (insertedPeople.length > 0) {
        await this.createRating({ personId: insertedPeople[0].id, rating: 5 });
        await this.createRating({ personId: insertedPeople[0].id, rating: 4 });
        await this.createRating({ personId: insertedPeople[1].id, rating: 2 });
        await this.createRating({ personId: insertedPeople[2].id, rating: 4 });
        await this.createRating({ personId: insertedPeople[3].id, rating: 1 });

        // Add sample comments
        await this.createComment({ 
          personId: insertedPeople[0].id, 
          content: "أحسن دكتور في الكلية! بيفهم الطلبة وصبور معاهم 👑" 
        });
        await this.createComment({ 
          personId: insertedPeople[1].id, 
          content: "بيذاكر كتير بس لما ييجي الامتحان مبيجيبش درجات... غريب 😅" 
        });
        await this.createComment({ 
          personId: insertedPeople[2].id, 
          content: "شغالة جامد في الشركة بس دايماً متوترة من كتر الشغل" 
        });
        await this.createComment({ 
          personId: insertedPeople[3].id, 
          content: "لو في نجمة سلبية كنت حطيت 😒 مفيش أي استفادة منه" 
        });
        
        // Add facemash votes
        await this.createFacemashVote({ winnerId: insertedPeople[0].id, loserId: insertedPeople[1].id });
        await this.createFacemashVote({ winnerId: insertedPeople[2].id, loserId: insertedPeople[3].id });
        await this.createFacemashVote({ winnerId: insertedPeople[0].id, loserId: insertedPeople[2].id });
      }
    } catch (error) {
      console.error('Error initializing sample data:', error);
    }
  }

  async createPerson(insertPerson: InsertPerson): Promise<Person> {
    const [person] = await db
      .insert(people)
      .values(insertPerson)
      .returning();
    return person;
  }

  async getAllPeople(): Promise<Person[]> {
    return await db.select().from(people).orderBy(desc(people.createdAt));
  }

  async getPeopleByCategory(category: string): Promise<Person[]> {
    return await db.select().from(people)
      .where(eq(people.category, category))
      .orderBy(desc(people.createdAt));
  }

  async getPersonById(id: number): Promise<Person | undefined> {
    const [person] = await db.select().from(people).where(eq(people.id, id));
    return person || undefined;
  }

  async updatePersonRating(id: number, averageRating: number, ratingCount: number): Promise<void> {
    await db.update(people)
      .set({ averageRating, ratingCount })
      .where(eq(people.id, id));
  }

  async getTopRatedPeople(limit: number): Promise<Person[]> {
    return await db.select().from(people)
      .where(sql`${people.ratingCount} > 0`)
      .orderBy(desc(people.averageRating))
      .limit(limit);
  }

  async createRating(insertRating: InsertRating): Promise<Rating> {
    const [rating] = await db
      .insert(ratings)
      .values(insertRating)
      .returning();

    // Update person's average rating
    const personRatings = await db.select().from(ratings)
      .where(eq(ratings.personId, insertRating.personId));
    
    const average = personRatings.reduce((sum, r) => sum + r.rating, 0) / personRatings.length;
    await this.updatePersonRating(insertRating.personId, average, personRatings.length);

    return rating;
  }

  async getRatingsByPersonId(personId: number): Promise<Rating[]> {
    return await db.select().from(ratings).where(eq(ratings.personId, personId));
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const [comment] = await db
      .insert(comments)
      .values(insertComment)
      .returning();

    // Update person's comments count
    const personComments = await db.select().from(comments)
      .where(eq(comments.personId, insertComment.personId));
    await this.updatePersonCommentsCount(insertComment.personId, personComments.length);

    return comment;
  }

  async getCommentsByPersonId(personId: number): Promise<Comment[]> {
    return await db.select().from(comments)
      .where(eq(comments.personId, personId))
      .orderBy(desc(comments.createdAt));
  }

  async updatePersonCommentsCount(personId: number, count: number): Promise<void> {
    await db.update(people)
      .set({ commentsCount: count })
      .where(eq(people.id, personId));
  }

  async createFacemashVote(insertVote: InsertFacemashVote): Promise<FacemashVote> {
    const [vote] = await db
      .insert(facemashVotes)
      .values(insertVote)
      .returning();
    
    // Update win/loss counts
    await db.update(people)
      .set({ facemashWins: sql`${people.facemashWins} + 1` })
      .where(eq(people.id, insertVote.winnerId));
      
    await db.update(people)
      .set({ facemashLosses: sql`${people.facemashLosses} + 1` })
      .where(eq(people.id, insertVote.loserId));
    
    return vote;
  }

  async getFacemashLeaderboard(): Promise<Person[]> {
    return await db.select().from(people)
      .orderBy(desc(sql`${people.facemashWins} - ${people.facemashLosses}`))
      .limit(10);
  }

  async getRandomPeopleForComparison(): Promise<[Person, Person] | null> {
    const allPeople = await db.select().from(people).orderBy(sql`RANDOM()`).limit(2);
    if (allPeople.length < 2) return null;
    return [allPeople[0], allPeople[1]];
  }

  async incrementViewCount(personId: number): Promise<void> {
    await db.update(people)
      .set({ viewCount: sql`${people.viewCount} + 1` })
      .where(eq(people.id, personId));
  }

  async getPersonStats(personId: number): Promise<{ totalVotes: number; winRate: number; } | null> {
    const [person] = await db.select().from(people).where(eq(people.id, personId));
    if (!person) return null;

    const wins = person.facemashWins || 0;
    const losses = person.facemashLosses || 0;
    const totalVotes = wins + losses;
    const winRate = totalVotes > 0 ? (wins / totalVotes) * 100 : 0;

    return { totalVotes, winRate };
  }

  async searchPeople(query: string): Promise<Person[]> {
    const searchTerm = `%${query.toLowerCase()}%`;
    return await db.select().from(people)
      .where(
        or(
          like(sql`LOWER(${people.name})`, searchTerm),
          like(sql`LOWER(${people.description})`, searchTerm),
          like(sql`LOWER(${people.category})`, searchTerm)
        )
      )
      .orderBy(desc(people.averageRating));
  }

  async getSiteStats(): Promise<{
    totalPeople: number;
    totalRatings: number;
    totalComments: number;
    totalFacemashVotes: number;
    avgRating: number;
    topCategory: string;
  }> {
    const [peopleCount] = await db.select({ count: sql<number>`count(*)` }).from(people);
    const [ratingsCount] = await db.select({ count: sql<number>`count(*)` }).from(ratings);
    const [commentsCount] = await db.select({ count: sql<number>`count(*)` }).from(comments);
    const [votesCount] = await db.select({ count: sql<number>`count(*)` }).from(facemashVotes);
    
    // Calculate average rating
    const [avgResult] = await db.select({ avg: sql<number>`avg(${ratings.rating})` }).from(ratings);
    const avgRating = avgResult.avg || 0;

    // Find top category
    const categoryResults = await db.select({
      category: people.category,
      count: sql<number>`count(*)`
    }).from(people).groupBy(people.category).orderBy(desc(sql`count(*)`)).limit(1);
    
    const topCategory = categoryResults[0]?.category || "غير محدد";

    return {
      totalPeople: peopleCount.count,
      totalRatings: ratingsCount.count,
      totalComments: commentsCount.count,
      totalFacemashVotes: votesCount.count,
      avgRating,
      topCategory,
    };
  }
}

export const storage = new DatabaseStorage();
