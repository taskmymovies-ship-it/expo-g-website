// @ts-nocheck
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { getDb } from "../../db/mongo";

const testimonialSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  name: z.string().min(1),
  role: z.string().default(""),
  company: z.string().default(""),
  image: z.string().min(1),
  variants: z
    .array(
      z.object({
        key: z.string().min(1),
        path: z.string().min(1),
        fileName: z.string().optional(),
        format: z.string().optional(),
        width: z.number().optional(),
        height: z.number().optional(),
        size: z.number().optional(),
      }),
    )
    .optional(),
  rating: z.number().int().min(1).max(5).default(5),
  quote: z.string().default(""),
});

const payloadSchema = z.object({
  hero: z
    .object({
      badge: z.string().default("Voices"),
      title: z.string().default("Testimonials"),
      intro: z
        .string()
        .default(
          "What our partners, founders, and attendees say about INDIA GLOBAL EXPO. Animated stories from the floor to the main stage.",
        ),
      ctaLabel: z.string().default("Send feedback"),
      ctaHref: z.string().default("/feedback"),
      ctaBadge: z.string().default("Share yours"),
      ctaTitle: z.string().default("Were you at the expo?"),
      ctaBody: z
        .string()
        .default(
          "Tell us what you loved, what you’d improve, and what you want to see next year. Your feedback shapes the next edition.",
        ),
    })
    .default({}),
  testimonials: z.array(testimonialSchema),
});

const listQuerySchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/)
    .transform((v) => Number(v))
    .catch(1)
    .optional(),
  pageSize: z
    .string()
    .regex(/^\d+$/)
    .transform((v) => Number(v))
    .catch(24)
    .optional(),
  search: z.string().optional(),
  rating: z
    .string()
    .regex(/^\d+$/)
    .transform((v) => Number(v))
    .optional(),
});

export default async function testimonialsRoutes(app: FastifyInstance) {
  app.get("/testimonials", async () => {
    const db = await getDb();
    const col = db.collection("testimonials");
    const stored = await col.findOne({ key: "default" });
    if (!stored) return payloadSchema.parse({ testimonials: [] });
    const parsed = payloadSchema.safeParse(stored);
    if (!parsed.success) return payloadSchema.parse({ testimonials: [] });
    return parsed.data;
  });

  app.get("/testimonials/list", async (request) => {
    const db = await getDb();
    const col = db.collection<{
      testimonials: z.infer<typeof testimonialSchema>[];
      hero: any;
    }>({} as any)("testimonials");
    const stored = await col.findOne({ key: "default" });
    const parsed = stored ? payloadSchema.safeParse(stored) : null;
    const testimonials = parsed?.success ? parsed.data.testimonials : [];

    const query = listQuerySchema.safeParse(request.query);
    const page = Math.max(
      query.success && query.data.page ? query.data.page : 1,
      1,
    );
    const pageSize = Math.min(
      Math.max(
        query.success && query.data.pageSize ? query.data.pageSize : 24,
        1,
      ),
      200,
    );
    const search = query.success ? query.data.search : undefined;
    const rating = query.success ? query.data.rating : undefined;

    let filtered = testimonials;
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.company.toLowerCase().includes(q) ||
          t.role.toLowerCase().includes(q) ||
          t.quote.toLowerCase().includes(q),
      );
    }
    if (rating) {
      filtered = filtered.filter((t) => t.rating === rating);
    }

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize);

    const ratings = Array.from(new Set(testimonials.map((t) => t.rating))).sort(
      (a, b) => a - b,
    );

    return {
      data,
      pagination: { page, pageSize, total, totalPages },
      filters: { ratings },
    };
  });

  app.put(
    "/testimonials",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const parsed = payloadSchema.safeParse(request.body);
      if (!parsed.success) {
        request.log.warn(
          { issues: parsed.error.issues },
          "testimonials.update validation failed",
        );
        return reply.code(400).send({ message: "Invalid payload" });
      }
      const db = await getDb();
      const col = db.collection("testimonials");
      await col.updateOne(
        { key: "default" },
        { $set: { key: "default", ...parsed.data } },
        { upsert: true },
      );
      request.log.info("testimonials.update success");
      return parsed.data;
    },
  );

  app.delete(
    "/testimonials/:id",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const db = await getDb();
      const col = db.collection("testimonials");
      const res = await col.updateOne(
        { key: "default" },
        { $pull: { testimonials: { id } } },
      );
      if (!res.modifiedCount)
        return reply.code(404).send({ message: "Testimonial not found" });
      request.log.info({ id }, "testimonials.delete removed");
      return { message: "Deleted", id };
    },
  );
}
// @ts-nocheck
