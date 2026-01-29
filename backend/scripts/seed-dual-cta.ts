import { getDb } from "../src/db/mongo";

const defaultDualCta = {
  key: "default",
  sellers: {
    eyebrow: "CTA • Sellers",
    title: "Showcase your brand at ICE Exhibitions",
    description:
      "Book a pavilion, plan your launch, and let our production team handle staging, media, and lead capture.",
    primary: { label: "Plan my showcase", href: "/partner" },
    secondary: { label: "Talk to production", href: "/contact" },
  },
  buyers: {
    eyebrow: "CTA • Buyers",
    title: "Be first to the next ICE edition",
    description:
      "Unlock schedules, early access drops, and curated routes tailored to what you want to see.",
    primary: { label: "Get buyer access", href: "/contact" },
    secondary: { label: "View full program", href: "/gallery" },
  },
};

const run = async () => {
  try {
    const db = await getDb();
    const col = db.collection("dual_cta");
    await col.updateOne(
      { key: "default" },
      { $set: defaultDualCta },
      { upsert: true },
    );
    console.log("Dual CTA seed applied.");
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

run();
