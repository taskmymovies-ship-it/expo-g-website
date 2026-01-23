import { getDb } from "../src/db/mongo";

const defaultBuyers = {
  key: "default",
  eyebrow: "Buyer Voices",
  title: "Why buyers keep coming back",
  description:
    "Decision-makers and superfans sharing how they navigate ICE—curated lanes, late-night sets, and baskets that keep growing.",
  ctaLabel: "See all buyer stories",
  ctaHref: "/buyers",
  buyers: [
    {
      id: "buyer-1",
      name: "Aanya Singh",
      city: "Mumbai",
      segment: "Lifestyle buyer",
      quote:
        "I plan routes on their app and still end up staying longer—too many good stalls and after-hours sets.",
      spend: "Avg. cart: ₹18K",
      visits: "4th year",
      image:
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&h=800&fit=crop",
      href: "/buyers/buyer-1",
    },
    {
      id: "buyer-2",
      name: "Rahul Mehta",
      city: "Delhi",
      segment: "Electronics",
      quote:
        "Workshops and deals in one place. I closed vendor contracts and picked up gear the same day.",
      spend: "₹22K at expo",
      visits: "3rd year",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop",
      href: "/buyers/buyer-2",
    },
    {
      id: "buyer-3",
      name: "Simran Kaur",
      city: "Bengaluru",
      segment: "Home & Decor",
      quote:
        "Love the curated lanes—less wandering, more discovering. The lounge keeps me around till late.",
      spend: "₹15K basket",
      visits: "5th year",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop",
      href: "/buyers/buyer-3",
    },
    {
      id: "buyer-4",
      name: "Arjun Pillai",
      city: "Chennai",
      segment: "Automotive",
      quote:
        "Test drives, finance desks, and product drops in one circuit. Zero downtime between sessions.",
      spend: "₹35K committed",
      visits: "2nd year",
      image:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop",
      href: "/buyers/buyer-4",
    },
  ],
};

const run = async () => {
  try {
    const db = await getDb();
    const col = db.collection("buyers");
    await col.updateOne(
      { key: "default" },
      { $set: defaultBuyers },
      { upsert: true },
    );
    console.log("Buyers seed applied.");
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

run();
