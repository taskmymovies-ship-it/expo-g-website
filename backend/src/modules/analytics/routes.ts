// @ts-nocheck
import { FastifyInstance } from "fastify";
import { getDb } from "../../db/mongo";
import { getRedis } from "../../db/redis";
import { DateTime } from "luxon";
import profileConfigRoutes from "../profile-config/routes";

export default async function analyticsRoutes(app: FastifyInstance) {
  app.get(
    "/admin/analytics/gallery-summary",
    { preHandler: [app.authenticate] },
    async () => {
      const db = await getDb();
      const col = db.collection("gallery");

      const totalItems = await col.estimatedDocumentCount();

      const commentsAgg = await col
        .aggregate([
          { $project: { count: { $size: { $ifNull: ["$comments", []] } } } },
          { $group: { _id: null, total: { $sum: "$count" } } },
        ])
        .toArray();
      const totalComments = commentsAgg[0]?.total || 0;

      let totalLikes = 0;
      const likesAgg = await col.aggregate([{ $group: { _id: null, total: { $sum: "$likes" } } }]).toArray();
      totalLikes += likesAgg[0]?.total || 0;
      try {
        const redis = getRedis();
        const buffers = await redis.hvals("gallery:like-buffer");
        totalLikes += buffers.reduce((acc, v) => acc + Number(v || 0), 0);
      } catch {
        // ignore redis errors
      }

      const byCategory = await col
        .aggregate([
          { $group: { _id: "$category", count: { $sum: 1 } } },
          { $project: { category: "$_id", count: 1, _id: 0 } },
          { $sort: { count: -1 } },
        ])
        .toArray();

      const byYear = await col
        .aggregate([
          { $group: { _id: "$year", count: { $sum: 1 } } },
          { $project: { year: "$_id", count: 1, _id: 0 } },
          { $sort: { year: -1 } },
        ])
        .toArray();

      const topTags = await col
        .aggregate([
          { $unwind: "$tags" },
          { $group: { _id: "$tags", count: { $sum: 1 } } },
          { $project: { tag: "$_id", count: 1, _id: 0 } },
          { $sort: { count: -1 } },
          { $limit: 10 },
        ])
        .toArray();

      return {
       totalItems,
       likes: totalLikes,
       comments: totalComments,
       byCategory,
       byYear,
       topTags,
     };
    }
  );
  
  app.get(
    "/admin/analytics/gallery-engagement",
    { preHandler: [app.authenticate] },
    async (request) => {
      const { limit = "10", sort = "likes" } = request.query as { limit?: string; sort?: "likes" | "comments" };
      const num = Math.min(Math.max(parseInt(limit || "10", 10) || 10, 1), 100);
      const db = await getDb();
      const col = db.collection("gallery");
      const docs = await col
        .find({}, { projection: { id: 1, title: 1, likes: 1, comments: 1 } })
        .toArray();

      let buffers: Record<string, number> = {};
      try {
        const redis = getRedis();
        const ids = docs.map((d) => d.id);
        const results = await Promise.all(ids.map((id) => redis.hget("gallery:like-buffer", id)));
        buffers = ids.reduce((acc, id, idx) => {
          const val = results[idx];
          if (val) acc[id] = Number(val);
          return acc;
        }, {} as Record<string, number>);
      } catch {
        buffers = {};
      }

      const items = docs.map((d) => {
        const likes = (d as any).likes || 0;
        const buffered = buffers[d.id] || 0;
        const comments = Array.isArray((d as any).comments) ? (d as any).comments.length : 0;
        return { id: (d as any).id, title: (d as any).title, likes: likes + buffered, comments };
      });

      const sorted = items.sort((a, b) => (sort === "comments" ? b.comments - a.comments : b.likes - a.likes));
      return { data: sorted.slice(0, num) };
    }
  );

  app.get(
    "/admin/analytics/users",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const db = await getDb();
      const col = db.collection("users");
      const total = await col.estimatedDocumentCount();

      const now = DateTime.now().setZone("UTC");
      const startOfToday = now.startOf("day").toJSDate();
      const last7 = now.minus({ days: 7 }).toJSDate();
      const last30 = now.minus({ days: 30 }).toJSDate();

      const [today, last7d, last30d] = await Promise.all([
        col.countDocuments({ createdAt: { $gte: startOfToday } }),
        col.countDocuments({ createdAt: { $gte: last7 } }),
        col.countDocuments({ createdAt: { $gte: last30 } }),
      ]);

      return { total, today, last7d, last30d };
    }
  );

  app.get(
    "/admin/analytics/timeseries",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const { kind = "forms", days = "30", tz = "UTC" } = request.query as {
        kind?: "forms" | "comments";
        days?: string;
        tz?: string;
      };
      const window = Math.min(Math.max(parseInt(days || "30", 10) || 30, 1), 180);
      const start = DateTime.now().setZone(tz).minus({ days: window }).startOf("day");

      if (kind === "forms") {
        const db = await getDb();
        const col = db.collection("forms_submissions");
        const data = await col
          .aggregate([
            { $match: { createdAt: { $gte: start.toJSDate() } } },
            { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: tz } }, count: { $sum: 1 } } },
            { $project: { date: "$_id", count: 1, _id: 0 } },
            { $sort: { date: 1 } },
          ])
          .toArray();
        return { kind, points: data };
      }

      if (kind === "comments") {
        const db = await getDb();
        const col = db.collection("gallery");
        const data = await col
          .aggregate([
            { $unwind: "$comments" },
            { $addFields: { "comments.dateObj": { $toDate: "$comments.date" } } },
            { $match: { "comments.dateObj": { $gte: start.toJSDate() } } },
            {
              $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$comments.dateObj", timezone: tz } },
                count: { $sum: 1 },
              },
            },
            { $project: { date: "$_id", count: 1, _id: 0 } },
            { $sort: { date: 1 } },
          ])
          .toArray();
       return { kind, points: data };
      }

      return reply.code(400).send({ message: "Unsupported kind" });
    }
  );
}
// @ts-nocheck
