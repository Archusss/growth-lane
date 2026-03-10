import { db } from "./db";
import { 
  users, ebooks, downloads, views, pageViews, contactMessages, 
  type User, type Ebook, type ContactMessage,
  type InsertEbook, type InsertContactMessage 
} from "@shared/schema";
import { eq, sql } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: { username: string; passwordHash: string; role?: string }): Promise<User>;
  
  // Ebooks
  getEbooks(): Promise<Ebook[]>;
  getEbook(id: number): Promise<Ebook | undefined>;
  createEbook(ebook: InsertEbook): Promise<Ebook>;
  updateEbook(id: number, updates: Partial<InsertEbook>): Promise<Ebook | undefined>;
  deleteEbook(id: number): Promise<boolean>;
  incrementEbookView(id: number, visitorIp?: string): Promise<void>;
  incrementEbookDownload(id: number, visitorIp?: string): Promise<void>;
  
  // Contact
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
  
  // Analytics
  trackPageView(path: string, visitorIp?: string): Promise<void>;
  getAnalyticsOverview(): Promise<{ totalVisitors: number; uniqueVisitors: number; pageViews: number }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: { username: string; passwordHash: string; role?: string }): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async getEbooks(): Promise<Ebook[]> {
    return await db.select().from(ebooks).orderBy(sql`${ebooks.createdAt} DESC`);
  }

  async getEbook(id: number): Promise<Ebook | undefined> {
    const [ebook] = await db.select().from(ebooks).where(eq(ebooks.id, id));
    return ebook;
  }

  async createEbook(ebook: InsertEbook): Promise<Ebook> {
    const [newEbook] = await db.insert(ebooks).values(ebook).returning();
    return newEbook;
  }

  async updateEbook(id: number, updates: Partial<InsertEbook>): Promise<Ebook | undefined> {
    const [updatedEbook] = await db.update(ebooks)
      .set(updates)
      .where(eq(ebooks.id, id))
      .returning();
    return updatedEbook;
  }

  async deleteEbook(id: number): Promise<boolean> {
    const [deleted] = await db.delete(ebooks).where(eq(ebooks.id, id)).returning();
    return !!deleted;
  }

  async incrementEbookView(id: number, visitorIp?: string): Promise<void> {
    await db.update(ebooks)
      .set({ viewCount: sql`${ebooks.viewCount} + 1` })
      .where(eq(ebooks.id, id));
    
    await db.insert(views).values({ ebookId: id, visitorIp });
  }

  async incrementEbookDownload(id: number, visitorIp?: string): Promise<void> {
    await db.update(ebooks)
      .set({ downloadCount: sql`${ebooks.downloadCount} + 1` })
      .where(eq(ebooks.id, id));
      
    await db.insert(downloads).values({ ebookId: id, visitorIp });
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [newMessage] = await db.insert(contactMessages).values(message).returning();
    return newMessage;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages).orderBy(sql`${contactMessages.timestamp} DESC`);
  }

  async trackPageView(path: string, visitorIp?: string): Promise<void> {
    await db.insert(pageViews).values({ path, visitorIp });
  }

  async getAnalyticsOverview(): Promise<{ totalVisitors: number; uniqueVisitors: number; pageViews: number }> {
    const [{ totalPageViews }] = await db.select({ totalPageViews: sql<number>`count(*)::int` }).from(pageViews);
    const [{ uniquePageVisitors }] = await db.select({ uniquePageVisitors: sql<number>`count(distinct visitor_ip)::int` }).from(pageViews).where(sql`visitor_ip IS NOT NULL`);
    
    // For a simple overview, let's consider totalVisitors = unique page visitors, etc.
    return {
      totalVisitors: totalPageViews, // total raw hits
      uniqueVisitors: uniquePageVisitors, // unique IPs
      pageViews: totalPageViews,
    };
  }
}

export const storage = new DatabaseStorage();
