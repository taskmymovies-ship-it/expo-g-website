import { getDb } from "../src/db/mongo";

const defaultFounders = {
  key: "default",
  eyebrow: "Review the moment",
  title: "Founders of ICE 1.0 & ICE 2.0",
  description:
    "From offline arches to hybrid broadcasts—meet the founders who evolved ICE from city expos to a national platform.",
  ctaLabel: "See all founders",
  ctaHref: "/founders",
  founders: [
    {
      name: "Aishwarya",
      title: "Co-Founder & Showrunner",
      era: "ICE 1.0",
      focus: "Offline expos, staging, and brand experience",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop",
      highlight:
        "Architected the inaugural expo arches and main stage playbook that still anchors ICE.",
      href: "/founders/founder-aishwarya",
      social: { linkedin: "https://linkedin.com/in/aishwarya" },
    },
    {
      name: "Vijay",
      title: "Co-Founder & Operations Lead",
      era: "ICE 1.0",
      focus: "City expansions, logistics, and vendor ecosystems",
      image:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop",
      highlight:
        "Scaled ICE from a single-city showcase to a multi-city circuit with consistent quality.",
      href: "/founders/founder-vijay",
    },
    {
      name: "Niyathi",
      title: "Co-Founder, ICE 2.0 (IGE)",
      era: "ICE 2.0",
      focus: "Hybrid product, media pods, and live streaming",
      image:
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&h=800&fit=crop",
      highlight:
        "Launched IGE, blending on-ground showcases with real-time digital broadcasts.",
      href: "/founders/founder-niyathi",
    },
    {
      name: "Vishnu",
      title: "Co-Founder, ICE 2.0 (IGN)",
      era: "ICE 2.0",
      focus: "Network, partners, and digital-first attendee journey",
      image:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&h=800&fit=crop",
      highlight:
        "Built IGN’s partner network and data-driven attendee routes for hybrid editions.",
      href: "/founders/founder-vishnu",
    },
  ],
};

const run = async () => {
  try {
    const db = await getDb();
    const col = db.collection("founders");
    await col.updateOne(
      { key: "default" },
      { $set: defaultFounders },
      { upsert: true },
    );
    console.log("Founders seed applied.");
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

run();
