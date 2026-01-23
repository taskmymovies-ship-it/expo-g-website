import { getDb } from "../src/db/mongo";

const defaultCelebrities = {
  key: "default",
  eyebrow: "Celebrity Photos",
  title: "Faces that amplify the spotlight",
  description:
    "Performers, hosts, and investors who bring star power to ICE Exhibitions.",
  ctaLabel: "See all appearances",
  ctaHref: "/gallery?tag=vip",
  celebrities: [
    {
      name: "Aarav Kapoor",
      title: "Film Actor",
      quote: "ICE Exhibitions made the stage feel like a cinematic premiere.",
      image:
        "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=600&h=800&fit=crop",
      badge: "Keynote Guest",
      href: "/gallery/vip-summit",
    },
    {
      name: "Ishita Rao",
      title: "Singer & Performer",
      quote: "The energy of the crowd here is unmatched.",
      image:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=800&fit=crop",
      badge: "Headliner",
      href: "/gallery/executive-lounge",
    },
    {
      name: "Vihaan Mehta",
      title: "Tech Influencer",
      quote: "Every zone is built for shareable moments.",
      image:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&h=800&fit=crop",
      badge: "Guest Host",
      href: "/gallery/vip-summit",
    },
    {
      name: "Zara Ali",
      title: "Entrepreneur",
      quote: "A perfect blend of business and festival vibes.",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop",
      badge: "Investor Panel",
      href: "/gallery/executive-lounge",
    },
  ],
};

const run = async () => {
  try {
    const db = await getDb();
    const col = db.collection("celebrities");
    await col.updateOne(
      { key: "default" },
      { $set: defaultCelebrities },
      { upsert: true },
    );
    console.log("Celebrities seed applied.");
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

run();
