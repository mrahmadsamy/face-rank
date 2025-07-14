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
    
    // Add some sample data to demonstrate the platform
    this.initializeSampleData();
  }

  private async initializeSampleData() {
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

    for (const personData of samplePeople) {
      await this.createPerson(personData);
    }

    // Add sample ratings
    await this.createRating({ personId: 1, rating: 5 });
    await this.createRating({ personId: 1, rating: 4 });
    await this.createRating({ personId: 2, rating: 2 });
    await this.createRating({ personId: 3, rating: 4 });
    await this.createRating({ personId: 4, rating: 1 });

    // Add sample comments
    await this.createComment({ 
      personId: 1, 
      content: "أحسن دكتور في الكلية! بيفهم الطلبة وصبور معاهم 👑" 
    });
    await this.createComment({ 
      personId: 2, 
      content: "بيذاكر كتير بس لما ييجي الامتحان مبيجيبش درجات... غريب 😅" 
    });
    await this.createComment({ 
      personId: 3, 
      content: "شغالة جامد في الشركة بس دايماً متوترة من كتر الشغل" 
    });
    await this.createComment({ 
      personId: 4, 
      content: "لو في نجمة سلبية كنت حطيت 😒 مفيش أي استفادة منه" 
    });
    
    // Add facemash votes
    await this.createFacemashVote({ winnerId: 1, loserId: 2 });
    await this.createFacemashVote({ winnerId: 3, loserId: 4 });
    await this.createFacemashVote({ winnerId: 1, loserId: 3 });
  }

  async createPerson(insertPerson: InsertPerson): Promise<Person> {
    const id = this.currentPersonId++;
    const person: Person = {
      ...insertPerson,
      id,
      averageRating: 0,
      ratingCount: 0,
      commentsCount: 0,
      facemashWins: 0,
      facemashLosses: 0,
      viewCount: 0,
      isVerified: 0,
      createdAt: new Date(),
    };
    this.people.set(id, person);
    return person;
  }

  async getAllPeople(): Promise<Person[]> {
    return Array.from(this.people.values()).sort((a, b) => 
      new Date(b.createdAt || new Date()).getTime() - new Date(a.createdAt || new Date()).getTime()
    );
  }

  async getPeopleByCategory(category: string): Promise<Person[]> {
    return Array.from(this.people.values())
      .filter(person => person.category === category)
      .sort((a, b) => new Date(b.createdAt || new Date()).getTime() - new Date(a.createdAt || new Date()).getTime());
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
      .filter(person => (person.ratingCount || 0) > 0)
      .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
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
      .sort((a, b) => new Date(b.createdAt || new Date()).getTime() - new Date(a.createdAt || new Date()).getTime());
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
    
    // Update win/loss counts
    const winner = this.people.get(insertVote.winnerId);
    const loser = this.people.get(insertVote.loserId);
    
    if (winner) {
      winner.facemashWins = (winner.facemashWins || 0) + 1;
      this.people.set(insertVote.winnerId, winner);
    }
    
    if (loser) {
      loser.facemashLosses = (loser.facemashLosses || 0) + 1;
      this.people.set(insertVote.loserId, loser);
    }
    
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

  async incrementViewCount(personId: number): Promise<void> {
    const person = this.people.get(personId);
    if (person) {
      person.viewCount = (person.viewCount || 0) + 1;
      this.people.set(personId, person);
    }
  }

  async getPersonStats(personId: number): Promise<{ totalVotes: number; winRate: number; } | null> {
    const person = this.people.get(personId);
    if (!person) return null;

    const wins = person.facemashWins || 0;
    const losses = person.facemashLosses || 0;
    const totalVotes = wins + losses;
    const winRate = totalVotes > 0 ? (wins / totalVotes) * 100 : 0;

    return { totalVotes, winRate };
  }

  async searchPeople(query: string): Promise<Person[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.people.values())
      .filter(person => 
        person.name.toLowerCase().includes(searchTerm) ||
        person.description.toLowerCase().includes(searchTerm) ||
        person.category.toLowerCase().includes(searchTerm)
      )
      .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
  }

  async getSiteStats(): Promise<{
    totalPeople: number;
    totalRatings: number;
    totalComments: number;
    totalFacemashVotes: number;
    avgRating: number;
    topCategory: string;
  }> {
    const people = Array.from(this.people.values());
    const ratings = Array.from(this.ratings.values());
    const comments = Array.from(this.comments.values());
    const votes = Array.from(this.facemashVotes.values());

    // Calculate average rating
    const totalRatingSum = ratings.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = ratings.length > 0 ? totalRatingSum / ratings.length : 0;

    // Find top category
    const categoryCount = people.reduce((acc, person) => {
      acc[person.category] = (acc[person.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topCategory = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || "غير محدد";

    return {
      totalPeople: people.length,
      totalRatings: ratings.length,
      totalComments: comments.length,
      totalFacemashVotes: votes.length,
      avgRating,
      topCategory,
    };
  }
}

export const storage = new MemStorage();
