import { getDb } from "../src/db/mongo";

const defaultSellers = {
  key: "default",
  eyebrow: "Seller Voices",
  title: "Proof from the sellers’ side",
  description:
    "Momentum snapshots instead of long testimonials—outcomes, conversion lifts, and the playbook that made them happen.",
  ctaLabel: "See all sellers",
  ctaHref: "/sellers",
  sellers: [
    {
      id: "seller-1",
      name: "Priya Menon",
      role: "Founder",
      company: "Studio Meridian",
      quote:
        "We sold out inventory by day two—footfall stayed consistent because the booth schedule was choreographed for us.",
      outcome: "+42% repeat visits vs. last expo",
      image:
        "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=600&h=800&fit=crop",
      href: "/sellers/seller-1",
    },
    {
      id: "seller-2",
      name: "Rajat Verma",
      role: "Director of Sales",
      company: "NovaCraft",
      quote:
        "Lead capture, live demos, and media hits happened in one lane. ICE made us feel like a headline act, not a booth number.",
      outcome: "210 meetings booked on-site",
      image:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop",
      href: "/sellers/seller-2",
    },
    {
      id: "seller-3",
      name: "Nisha Kapoor",
      role: "COO",
      company: "Arka Living",
      quote:
        "They coached our team on storytelling and timing. Every two-hour drop felt like a mini-launch.",
      outcome: "3.1x lift in qualified leads",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop",
      href: "/sellers/seller-3",
    },
  ],
};

const run = async () => {
  try {
    const db = await getDb();
    const col = db.collection("sellers");
    await col.updateOne(
      { key: "default" },
      { $set: defaultSellers },
      { upsert: true },
    );
    console.log("Sellers seed applied.");
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

run();
