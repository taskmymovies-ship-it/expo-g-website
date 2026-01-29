import { getDb } from "../src/db/mongo";

type Highlight = { title: string; body: string };
type Metric = { label: string; value: string };

type Cofounder = {
  id: string;
  name: string;
  track: "IGE" | "IGN" | "IGE & IGN";
  title: string;
  focus: string;
  image: string;
  highlight: string;
  href?: string;
  social?: { linkedin?: string; twitter?: string; website?: string };
  detail?: {
    headline?: string;
    summary?: string;
    heroImage?: string;
    highlights?: Highlight[];
    metrics?: Metric[];
    pullQuote?: string;
    ctaLabel?: string;
    ctaHref?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
};

const cofounders: Cofounder[] = [
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
    detail: {
      headline: "XR-first show direction",
      summary:
        "Designed camera blocking and XR cues for IGE's hybrid keynotes.",
      heroImage:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=1200&auto=format&fit=crop&q=80",
      highlights: [
        {
          title: "XR cues",
          body: "Mapped XR overlays to stage beats for live + stream audiences.",
        },
        {
          title: "Media pods",
          body: "Distributed pods clipped and packaged segments in minutes.",
        },
      ],
      metrics: [
        { label: "Live reach", value: "2.1M" },
        { label: "Segments", value: "420" },
      ],
      ctaLabel: "View professional profile",
      ctaHref: "/cofounders/ritika",
    },
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
    detail: {
      headline: "Partner graph that converts",
      summary:
        "Matched partner tiers to attendee intent signals to lift conversions.",
      heroImage:
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=1200&auto=format&fit=crop&q=80",
      highlights: [
        {
          title: "Tiered ladders",
          body: "Structured packages aligned to digital + on-ground reach.",
        },
        {
          title: "Intent routing",
          body: "Signals mapped to recommended partner booths.",
        },
      ],
      metrics: [
        { label: "Partner lift", value: "+28%" },
        { label: "Sponsors onboarded", value: "180" },
      ],
      pullQuote: "Partners felt the intent data working for them.",
    },
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
    detail: {
      headline: "Telemetry-first stage ops",
      summary:
        "Health dashboards for XR, cameras, and audio to keep streams stable.",
      heroImage:
        "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&auto=format&fit=crop&q=80",
      highlights: [
        {
          title: "Health checks",
          body: "Automated checks before each block reduced retries.",
        },
        { title: "Alerting", body: "On-call playbooks with auto ticketing." },
      ],
      metrics: [
        { label: "Downtime", value: "-24%" },
        { label: "Auto-resolved", value: "68%" },
      ],
    },
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
    detail: {
      headline: "Attendee routing OS",
      summary: "Signals + lounges that kept decision-makers in the flow.",
      heroImage:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&auto=format&fit=crop&q=80",
      highlights: [
        {
          title: "Signal graph",
          body: "Push routes based on interests and schedule density.",
        },
        {
          title: "Premium lounges",
          body: "Exec lounges with prepped dossiers for meetings.",
        },
      ],
      metrics: [
        { label: "Exec dwell", value: "6.5h" },
        { label: "Meetings booked", value: "240" },
      ],
    },
  },
  {
    id: "cofounder-dual",
    name: "Zoya Merchant",
    track: "IGE & IGN",
    title: "Chief Experience Officer",
    focus: "Experience, hospitality, service design",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&auto=format&fit=crop&q=80",
    highlight:
      "Merged IGE showcraft with IGN hospitality to lift NPS across editions.",
    href: "/cofounders/cofounder-dual",
    social: { linkedin: "https://linkedin.com/in/zoyamerchant" },
    detail: {
      headline: "Experience meets service design",
      summary: "Unified scripts, signage, and lounge flows across both tracks.",
      heroImage:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1200&auto=format&fit=crop&q=80",
      highlights: [
        {
          title: "Unified scripts",
          body: "Service scripts aligned across IGE and IGN teams.",
        },
        {
          title: "Signage system",
          body: "Shared wayfinding reduced friction for mixed audiences.",
        },
      ],
      metrics: [
        { label: "NPS lift", value: "+16" },
        { label: "Helpdesk load", value: "-22%" },
      ],
      ctaLabel: "View CX profile",
      ctaHref: "/cofounders/zoya",
    },
  },
  {
    id: "cofounder-media",
    name: "Ishaan Verma",
    track: "IGE & IGN",
    title: "Head of Media Labs",
    focus: "Content, clips, distribution",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=80",
    highlight: "Built media labs for rapid clip creation across both tracks.",
    href: "/cofounders/cofounder-media",
    social: { linkedin: "https://linkedin.com/in/ishaanverma" },
    detail: {
      headline: "Media labs at show pace",
      summary: "Clip factories with templates for both IGE and IGN sponsors.",
      heroImage:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200&auto=format&fit=crop&q=80",
      highlights: [
        {
          title: "Template library",
          body: "Lower-thirds, bumpers, and overlays pre-baked for speed.",
        },
        {
          title: "Dual pipelines",
          body: "Ran simultaneous pipelines for IGE (XR) and IGN (partners).",
        },
      ],
      metrics: [
        { label: "Clips/day", value: "280" },
        { label: "Turnaround", value: "<12 min" },
      ],
    },
  },
];

const run = async () => {
  try {
    const db = await getDb();
    const col = db.collection<Cofounder>("cofounders_list");
    await col.deleteMany({});
    const now = new Date();
    await col.insertMany(
      cofounders.map((c) => ({ ...c, createdAt: now, updatedAt: now })),
    );
    console.log(`Seeded ${cofounders.length} cofounders.`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

run();
