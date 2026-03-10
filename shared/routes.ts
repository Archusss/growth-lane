import { z } from "zod";
import { insertEbookSchema, insertContactMessageSchema, ebooks, contactMessages, users, loginSchema } from "./schema";

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  unauthorized: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
};

export const api = {
  auth: {
    login: {
      method: "POST" as const,
      path: "/api/auth/login" as const,
      input: loginSchema,
      responses: {
        200: z.object({ message: z.string() }),
        401: errorSchemas.unauthorized,
      }
    },
    logout: {
      method: "POST" as const,
      path: "/api/auth/logout" as const,
      responses: {
        200: z.object({ message: z.string() }),
      }
    },
    me: {
      method: "GET" as const,
      path: "/api/auth/me" as const,
      responses: {
        200: z.custom<Omit<typeof users.$inferSelect, "passwordHash">>(),
        401: errorSchemas.unauthorized,
      }
    }
  },
  ebooks: {
    list: {
      method: "GET" as const,
      path: "/api/ebooks" as const,
      responses: {
        200: z.array(z.custom<typeof ebooks.$inferSelect>()),
      }
    },
    get: {
      method: "GET" as const,
      path: "/api/ebooks/:id" as const,
      responses: {
        200: z.custom<typeof ebooks.$inferSelect>(),
        404: errorSchemas.notFound,
      }
    },
    create: {
      method: "POST" as const,
      path: "/api/ebooks" as const,
      // Input is multipart/form-data; zod parsing is handled manually
      responses: {
        201: z.custom<typeof ebooks.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      }
    },
    update: {
      method: "PUT" as const,
      path: "/api/ebooks/:id" as const,
      input: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
      }),
      responses: {
        200: z.custom<typeof ebooks.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      }
    },
    delete: {
      method: "DELETE" as const,
      path: "/api/ebooks/:id" as const,
      responses: {
        204: z.void(),
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      }
    },
    trackView: {
      method: "POST" as const,
      path: "/api/ebooks/:id/view" as const,
      responses: {
        200: z.object({ success: z.boolean() })
      }
    },
    download: {
      method: "GET" as const,
      path: "/api/ebooks/:id/download" as const,
      responses: {
        200: z.any(),
        404: errorSchemas.notFound,
      }
    }
  },
  contact: {
    submit: {
      method: "POST" as const,
      path: "/api/contact" as const,
      input: insertContactMessageSchema,
      responses: {
        201: z.custom<typeof contactMessages.$inferSelect>(),
        400: errorSchemas.validation,
      }
    },
    list: {
      method: "GET" as const,
      path: "/api/contact" as const,
      responses: {
        200: z.array(z.custom<typeof contactMessages.$inferSelect>()),
        401: errorSchemas.unauthorized,
      }
    }
  },
  analytics: {
    overview: {
      method: "GET" as const,
      path: "/api/analytics/overview" as const,
      responses: {
        200: z.object({
          totalVisitors: z.number(),
          uniqueVisitors: z.number(),
          pageViews: z.number(),
        }),
        401: errorSchemas.unauthorized,
      }
    },
    trackPageView: {
      method: "POST" as const,
      path: "/api/analytics/pageview" as const,
      input: z.object({ path: z.string() }),
      responses: {
        200: z.object({ success: z.boolean() })
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
