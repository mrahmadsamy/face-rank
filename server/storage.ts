import { Person, InsertPerson, Rating, InsertRating, Comment, InsertComment, FacemashVote, InsertFacemashVote } from "@shared/schema";

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
}

export class MemStorage implements IStorage {
  private people: Map<number, Person>;
  private ratings: Map<number, Rating>;
  private comments: Map<number, Comment>;
  private facemashVotes: Map<number, FacemashVote>;
  private currentPersonId: number;
  private currentRatingId: number;
  private currentCommentId: number;
  private currentVoteId: number;

  constructor() {
    this.people = new Map();
    this.ratings = new Map();
    this.comments = new Map();
    this.facemashVotes = new Map();
    this.currentPersonId = 1;
    this.currentRatingId = 1;
    this.currentCommentId = 1;
    this.currentVoteId = 1;
  }

  async createPerson(insertPerson: InsertPerson): Promise<Person> {
    const id = this.currentPersonId++;
    const person: Person = {
      ...insertPerson,
      id,
      averageRating: 0,
      ratingCount: 0,
      commentsCount: 0,
      createdAt: new Date(),
    };
    this.people.set(id, person);
    return person;
  }

  async getAllPeople(): Promise<Person[]> {
    return Array.from(this.people.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getPeopleByCategory(category: string): Promise<Person[]> {
    return Array.from(this.people.values())
      .filter(person => person.category === category)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getPersonById(id: number): Promise<Person | undefined> {
    return this.people.get(id);
  }

  async updatePersonRating(id: number, averageRating: number, ratingCount: number): Promise<void> {
    const person = this.people.get(id);
    if (person) {
      person.averageRating = averageRating;
      person.ratingCount = ratingCount;
      this.people.set(id, person);
    }
  }

  async getTopRatedPeople(limit: number): Promise<Person[]> {
    return Array.from(this.people.values())
      .filter(person => person.ratingCount > 0)
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, limit);
  }

  async createRating(insertRating: InsertRating): Promise<Rating> {
    const id = this.currentRatingId++;
    const rating: Rating = {
      ...insertRating,
      id,
      createdAt: new Date(),
    };
    this.ratings.set(id, rating);

    // Update person's average rating
    const personRatings = await this.getRatingsByPersonId(insertRating.personId);
    const totalRating = personRatings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / personRatings.length;
    await this.updatePersonRating(insertRating.personId, averageRating, personRatings.length);

    return rating;
  }

  async getRatingsByPersonId(personId: number): Promise<Rating[]> {
    return Array.from(this.ratings.values()).filter(rating => rating.personId === personId);
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = this.currentCommentId++;
    const comment: Comment = {
      ...insertComment,
      id,
      createdAt: new Date(),
    };
    this.comments.set(id, comment);

    // Update person's comments count
    const personComments = await this.getCommentsByPersonId(insertComment.personId);
    await this.updatePersonCommentsCount(insertComment.personId, personComments.length);

    return comment;
  }

  async getCommentsByPersonId(personId: number): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter(comment => comment.personId === personId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async updatePersonCommentsCount(personId: number, count: number): Promise<void> {
    const person = this.people.get(personId);
    if (person) {
      person.commentsCount = count;
      this.people.set(personId, person);
    }
  }

  async createFacemashVote(insertVote: InsertFacemashVote): Promise<FacemashVote> {
    const id = this.currentVoteId++;
    const vote: FacemashVote = {
      ...insertVote,
      id,
      createdAt: new Date(),
    };
    this.facemashVotes.set(id, vote);
    return vote;
  }

  async getFacemashLeaderboard(): Promise<Person[]> {
    const voteWins = new Map<number, number>();
    const voteLosses = new Map<number, number>();

    Array.from(this.facemashVotes.values()).forEach(vote => {
      voteWins.set(vote.winnerId, (voteWins.get(vote.winnerId) || 0) + 1);
      voteLosses.set(vote.loserId, (voteLosses.get(vote.loserId) || 0) + 1);
    });

    return Array.from(this.people.values())
      .map(person => ({
        ...person,
        score: (voteWins.get(person.id) || 0) - (voteLosses.get(person.id) || 0)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }

  async getRandomPeopleForComparison(): Promise<[Person, Person] | null> {
    const allPeople = Array.from(this.people.values());
    if (allPeople.length < 2) return null;

    const shuffled = allPeople.sort(() => 0.5 - Math.random());
    return [shuffled[0], shuffled[1]];
  }
}

export const storage = new MemStorage();
