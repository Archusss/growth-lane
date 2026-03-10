import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("admin"),
});

export const ebooks = pgTable("ebooks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  pdfUrl: text("pdf_url").notNull(),
  coverImageUrl: text("cover_image_url").notNull(),
  viewCount: integer("view_count").notNull().default(0),
  downloadCount: integer("download_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const downloads = pgTable("downloads", {
  id: serial("id").primaryKey(),
  ebookId: integer("ebook_id").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  visitorIp: text("visitor_ip"),
});

export const views = pgTable("views", {
  id: serial("id").primaryKey(),
  ebookId: integer("ebook_id").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  visitorIp: text("visitor_ip"),
});

export const pageViews = pgTable("page_views", {
  id: serial("id").primaryKey(),
  path: text("path").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  visitorIp: text("visitor_ip"),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  instagram: text("instagram"),
  message: text("message").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Base types
export type User = typeof users.$inferSelect;
export type Ebook = typeof ebooks.$inferSelect;
export type ContactMessage = typeof contactMessages.$inferSelect;

// Schemas
export const insertEbookSchema = createInsertSchema(ebooks).omit({ 
  id: true, 
  createdAt: true, 
  viewCount: true, 
  downloadCount: true 
});
export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({ 
  id: true, 
  timestamp: true 
});

export type InsertEbook = z.infer<typeof insertEbookSchema>;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;

// API Request Types
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});
export type LoginRequest = z.infer<typeof loginSchema>;
