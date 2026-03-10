import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import passport from "passport";
import { setupAuth } from "./auth";
import multer from "multer";
import path from "path";
import express from "express";

// Set up multer for file uploads
const storageConfig = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "pdf") {
      cb(null, "uploads/ebooks/");
    } else if (file.fieldname === "coverImage") {
      cb(null, "uploads/covers/");
    } else {
      cb(new Error("Invalid fieldname"), "");
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storageConfig });

function ensureAdmin(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
  if (req.isAuthenticated() && (req.user as any).role === "admin") {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Set up authentication
  setupAuth(app);

  // Serve static files from uploads directory
  app.use("/uploads", express.static("uploads"));

  // ================= Auth Routes =================
  app.post(api.auth.login.path, passport.authenticate("local"), (req, res) => {
    res.status(200).json({ message: "Logged in successfully" });
  });

  app.post(api.auth.logout.path, (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.status(200).json({ message: "Logged out successfully" });
    });
  });

  app.get(api.auth.me.path, (req, res) => {
    if (req.isAuthenticated()) {
      const user = req.user as any;
      const { passwordHash, ...safeUser } = user;
      res.status(200).json(safeUser);
    } else {
      res.status(401).json({ message: "Not logged in" });
    }
  });

  // ================= Ebook Routes =================
  app.get(api.ebooks.list.path, async (req, res) => {
    const ebooks = await storage.getEbooks();
    res.status(200).json(ebooks);
  });

  app.get(api.ebooks.get.path, async (req, res) => {
    const ebook = await storage.getEbook(Number(req.params.id));
    if (!ebook) {
      return res.status(404).json({ message: "Ebook not found" });
    }
    res.status(200).json(ebook);
  });

  // Protected route for creating ebooks
  app.post(
    api.ebooks.create.path,
    // @ts-ignore
    ensureAdmin,
    upload.fields([
      { name: "pdf", maxCount: 1 },
      { name: "coverImage", maxCount: 1 },
    ]),
    async (req: any, res) => {
      try {
        const { title, description } = req.body;
        
        if (!title || !description) {
          return res.status(400).json({ message: "Title and description are required", field: "title" });
        }

        if (!req.files || !req.files.pdf || !req.files.coverImage) {
          return res.status(400).json({ message: "PDF and Cover Image are required", field: "files" });
        }

        const pdfFile = req.files.pdf[0];
        const coverFile = req.files.coverImage[0];

        const ebook = await storage.createEbook({
          title,
          description,
          pdfUrl: `/uploads/ebooks/${pdfFile.filename}`,
          coverImageUrl: `/uploads/covers/${coverFile.filename}`,
        });

        res.status(201).json(ebook);
      } catch (err) {
        console.error("Error creating ebook:", err);
        res.status(500).json({ message: "Failed to create ebook" });
      }
    }
  );

  app.put(api.ebooks.update.path, /* @ts-ignore */ ensureAdmin, async (req, res) => {
    try {
      const updates = api.ebooks.update.input.parse(req.body);
      const ebook = await storage.updateEbook(Number(req.params.id), updates);
      if (!ebook) {
        return res.status(404).json({ message: "Ebook not found" });
      }
      res.status(200).json(ebook);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      res.status(500).json({ message: "Failed to update ebook" });
    }
  });

  app.delete(api.ebooks.delete.path, /* @ts-ignore */ ensureAdmin, async (req, res) => {
    const success = await storage.deleteEbook(Number(req.params.id));
    if (!success) {
      return res.status(404).json({ message: "Ebook not found" });
    }
    res.status(204).end();
  });

  app.post(api.ebooks.trackView.path, async (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    await storage.incrementEbookView(Number(req.params.id), Array.isArray(ip) ? ip[0] : ip);
    res.status(200).json({ success: true });
  });

  app.get(api.ebooks.download.path, async (req, res) => {
    const ebook = await storage.getEbook(Number(req.params.id));
    if (!ebook) {
      return res.status(404).json({ message: "Ebook not found" });
    }

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    await storage.incrementEbookDownload(ebook.id, Array.isArray(ip) ? ip[0] : ip);

    // Provide the file for download
    const filePath = path.join(process.cwd(), ebook.pdfUrl);
    res.download(filePath, `${ebook.title}.pdf`);
  });

  // ================= Contact Routes =================
  app.post(api.contact.submit.path, async (req, res) => {
    try {
      const data = api.contact.submit.input.parse(req.body);
      const message = await storage.createContactMessage(data);
      res.status(201).json(message);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      res.status(500).json({ message: "Failed to submit contact message" });
    }
  });

  app.get(api.contact.list.path, /* @ts-ignore */ ensureAdmin, async (req, res) => {
    const messages = await storage.getContactMessages();
    res.status(200).json(messages);
  });

  // ================= Analytics Routes =================
  app.post(api.analytics.trackPageView.path, async (req, res) => {
    try {
      const { path } = api.analytics.trackPageView.input.parse(req.body);
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      await storage.trackPageView(path, Array.isArray(ip) ? ip[0] : ip);
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  app.get(api.analytics.overview.path, /* @ts-ignore */ ensureAdmin, async (req, res) => {
    const overview = await storage.getAnalyticsOverview();
    res.status(200).json(overview);
  });

  return httpServer;
}
