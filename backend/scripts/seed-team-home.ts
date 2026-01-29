import { getDb } from "../src/db/mongo";

/**
 * Seeds the home-page team block used by the Team Editor (/teams API).
 * Run with:  ts-node backend/scripts/seed-team-home.ts
 */
const seed = {
  key: "default",
  eyebrow: "Meet the team",
  title: "People who keep ICE running",
  description:
    "Production, media, growth, and design leaders behind the circuit.",
  ctaLabel: "See all team members",
  ctaHref: "/teams",
  team: [
    {
      id: "team-priya",
      name: "Priya Menon",
      role: "Head of Production",
      department: "Production",
      focus: "Stage ops, lighting, crew",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&auto=format&fit=crop&q=80",
      href: "/teams/team-priya",
    },
    {
      id: "team-kabir",
      name: "Kabir Shah",
      role: "CTO, Telemetry",
      department: "Technology",
      focus: "Infra, telemetry, automation",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&auto=format&fit=crop&q=80",
      href: "/teams/team-kabir",
    },
    {
      id: "team-rhea",
      name: "Rhea Menon",
      role: "Experience & Hospitality",
      department: "Experience",
      focus: "Guest journey, lounges, service design",
      image:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&auto=format&fit=crop&q=80",
      href: "/teams/team-rhea",
    },
    {
      id: "team-ishaan",
      name: "Ishaan Verma",
      role: "Head of Media Labs",
      department: "Media",
      focus: "Content pipelines, templates",
      image:
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=900&auto=format&fit=crop&q=80",
      href: "/teams/team-ishaan",
    },
    {
      id: "team-meera",
      name: "Meera Kulkarni",
      role: "Head of Ops, IGN",
      department: "Operations",
      focus: "Routing, lounges, partner ops",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&auto=format&fit=crop&q=80",
      href: "/teams/team-meera",
    },
    {
      id: "team-zoya",
      name: "Zoya Merchant",
      role: "Chief Experience Officer",
      department: "Experience",
      focus: "Experience, hospitality, service design",
      image:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=900&auto=format&fit=crop&q=80",
      href: "/teams/team-zoya",
    },
  ],
};

const run = async () => {
  try {
    const db = await getDb();
    const col = db.collection("teams");
    await col.updateOne({ key: "default" }, { $set: seed }, { upsert: true });
    console.log("Team home block seeded.");
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

run();
