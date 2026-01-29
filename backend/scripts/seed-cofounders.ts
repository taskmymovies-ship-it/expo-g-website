import { getDb } from "../src/db/mongo";

const defaultCoFounders = {
  key: "default",
  eyebrow: "Review the moment",
  title: "Co-founding team of ICE 2.0 (IGE & IGN)",
  description:
    "Builders behind the hybrid platform—linking on-ground showcases with digital broadcast networks.",
  ctaLabel: "See all co-founders",
  ctaHref: "/cofounders",
  cofounders: [
    {
      id: "cofounder-ige-1",
      name: "Ritika Iyer",
      track: "IGE",
      title: "Co-Founder, IGE",
      focus: "Immersive production, XR, broadcast",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=80",
      highlight:
        "Built the XR-first run-of-show for IGE with multi-cam streaming and media pods.",
      href: "/cofounders/cofounder-ige-1",
      social: { linkedin: "https://linkedin.com/in/ritika-iyer" },
    },
    {
      id: "cofounder-ign-1",
      name: "Arjun Nair",
      track: "IGN",
      title: "Co-Founder, IGN",
      focus: "Network, partnerships, data",
      image:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=80",
      highlight:
        "Built IGN’s partner graph and sponsorship ladder for hybrid editions.",
      href: "/cofounders/cofounder-ign-1",
      social: { linkedin: "https://linkedin.com/in/arjun-nair" },
    },
    {
      id: "cofounder-ige-ops",
      name: "Kabir Shah",
      track: "IGE",
      title: "CTO, IGE",
      focus: "Infra, telemetry, automation",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80",
      highlight:
        "Instrumented XR stages with telemetry and automated health checks.",
      href: "/cofounders/cofounder-ige-ops",
      social: { linkedin: "https://linkedin.com/in/kabirshah" },
    },
    {
      id: "cofounder-ign-ops",
      name: "Meera Kulkarni",
      track: "IGN",
      title: "Head of Operations, IGN",
      focus: "Attendee journey, routing, lounges",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=80",
      highlight:
        "Designed attendee routing for IGN with premium lounges and signals.",
      href: "/cofounders/cofounder-ign-ops",
      social: { linkedin: "https://linkedin.com/in/meerakulkarni" },
    },
  ],
};

const run = async () => {
  try {
    const db = await getDb();
    const col = db.collection("cofounders");
    await col.updateOne(
      { key: "default" },
      { $set: defaultCoFounders },
      { upsert: true },
    );
    console.log("Co-founders seed applied.");
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

run();
