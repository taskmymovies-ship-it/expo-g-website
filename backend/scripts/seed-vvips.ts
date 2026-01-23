import { getDb } from "../src/db/mongo";

const defaultVvips = {
  key: "default",
  eyebrow: "VVIPs",
  title: "Leaders who shaped the ICE stage",
  description:
    "Keynote guests, cultural envoys, and investors who elevated each edition.",
  ctaLabel: "See all VVIPs",
  ctaHref: "/gallery?tag=vip",
  guests: [
    {
      name: "Dr. Anika Sharma",
      title: "Union Minister",
      role: "Inaugural Address",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop",
      highlight:
        "Opened the 25th edition with policy keynote on innovation corridors.",
      href: "/gallery/executive-lounge",
    },
    {
      name: "Raj Malhotra",
      title: "Fortune 50 CEO",
      role: "Keynote",
      image:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop",
      highlight:
        "Announced a global R&D hub partnership live on the main stage.",
      href: "/gallery/vip-summit",
    },
    {
      name: "Justice Kavya Rao",
      title: "Chief Justice",
      role: "Guest of Honour",
      image:
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&h=800&fit=crop",
      highlight: "Championed safe-by-design standards for public experiences.",
      href: "/gallery/executive-lounge",
    },
    {
      name: "Arvind Kapoor",
      title: "Padma Awardee",
      role: "Cultural Envoy",
      image:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop",
      highlight:
        "Curated the opening art walk blending local crafts with kinetic light.",
      href: "/gallery/vip-summit",
    },
    {
      name: "Meera Joshi",
      title: "Global VC Partner",
      role: "Investor Track",
      image:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&h=800&fit=crop",
      highlight: "Led the investor lounge, fast-tracking 20+ startup pitches.",
      href: "/gallery/executive-lounge",
    },
    {
      name: "Lt. Gen. Rohit Sinha",
      title: "Defense Technologist",
      role: "Special Address",
      image:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop",
      highlight: "Shared dual-use tech frameworks for public safety at scale.",
      href: "/gallery/vip-summit",
    },
  ],
};

const run = async () => {
  try {
    const db = await getDb();
    const col = db.collection("vvips");
    await col.updateOne(
      { key: "default" },
      { $set: defaultVvips },
      { upsert: true },
    );
    console.log("VVIP seed applied.");
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

run();
