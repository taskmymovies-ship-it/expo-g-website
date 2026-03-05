import Fastify from "fastify";
import fs from "node:fs";
import path from "node:path";
import plugins from "./plugins";
import jwtPlugin from "./plugins/jwt";
import cachePlugin from "./plugins/cache";
import registerRoutes from "./modules";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { env } from "./config/env";

const contentTypeByExt: Record<string, string> = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".pdf": "application/pdf",
};

export const buildApp = () => {
  const app = Fastify({
    logger: {
      level: "info",
    },
  });

  app.register(plugins);
  app.register(jwtPlugin);
  app.register(cachePlugin);

  app.register(swagger, {
    openapi: {
      info: {
        title: "ICE API",
        version: "0.1.0",
      },
    },
  });

  app.register(swaggerUi, {
    routePrefix: "/docs",
  });

  app.get("/upload/*", async (request, reply) => {
    const wildcard = ((request.params as { "*": string })["*"] || "").trim();
    if (!wildcard) {
      return reply.code(404).send({ message: "File not found" });
    }

    const mediaRoot = path.resolve(env.mediaStoragePath);
    const relativePath = decodeURIComponent(wildcard).replace(/^\/+/, "");
    const absolutePath = path.resolve(mediaRoot, relativePath);
    const allowedPrefix = `${mediaRoot}${path.sep}`;

    if (absolutePath !== mediaRoot && !absolutePath.startsWith(allowedPrefix)) {
      return reply.code(403).send({ message: "Forbidden path" });
    }

    try {
      const stat = await fs.promises.stat(absolutePath);
      if (!stat.isFile()) {
        return reply.code(404).send({ message: "File not found" });
      }
    } catch {
      return reply.code(404).send({ message: "File not found" });
    }

    const ext = path.extname(absolutePath).toLowerCase();
    const contentType = contentTypeByExt[ext] || "application/octet-stream";
    reply.type(contentType);
    reply.header("Cache-Control", "public, max-age=31536000, immutable");
    return reply.send(fs.createReadStream(absolutePath));
  });

  app.register(registerRoutes);

  return app;
};
