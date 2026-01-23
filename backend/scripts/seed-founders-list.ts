import { getDb } from "../src/db/mongo";

type Highlight = { title: string; body: string };
type Metric = { label: string; value: string };

type Founder = {
  id: string;
  name: string;
  title: string;
  era: "ICE 1.0" | "ICE 2.0";
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

const founders: Founder[] = [
  {
    id: "founder-aishwarya",
    name: "Aishwarya",
    title: "Co-Founder & Showrunner",
    era: "ICE 1.0",
    focus: "Offline expos, staging, brand experience",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=80",
    highlight:
      "Architected the inaugural expo arches and main stage playbook that still anchors ICE.",
    href: "/founders/founder-aishwarya",
    social: { linkedin: "https://linkedin.com/in/aishwarya" },
    detail: {
      headline: "Playbooks that scaled across cities",
      summary:
        "Codified the entrance arches and main stage design into a repeatable template.",
      heroImage:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&auto=format&fit=crop&q=80",
      highlights: [
        {
          title: "Entrance archetype",
          body: "Designed arches now replicated across 10 cities.",
        },
        {
          title: "Showrunner ops",
          body: "Built run-of-show handoffs that reduced tech downtime.",
        },
      ],
      metrics: [
        { label: "Cities scaled", value: "10" },
        { label: "Staged shows", value: "200+" },
      ],
      pullQuote: "Staging became a system, not a gamble.",
      ctaLabel: "View professional profile",
      ctaHref: "/founders/aishwarya",
    },
  },
  {
    id: "founder-vijay",
    name: "Vijay",
    title: "Co-Founder & Operations Lead",
    era: "ICE 1.0",
    focus: "City expansions, logistics, vendor ecosystems",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=80",
    highlight:
      "Scaled ICE from a single-city showcase to a multi-city circuit with consistent quality.",
    href: "/founders/founder-vijay",
    social: { linkedin: "https://linkedin.com/in/vijay" },
    detail: {
      headline: "Ops that travel",
      summary:
        "Vendor matrices and logistics playbooks made every city launch predictable.",
      heroImage:
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=1200&auto=format&fit=crop&q=80",
      highlights: [
        {
          title: "Vendor matrix",
          body: "Approved vendor pool with SLAs for each city.",
        },
        {
          title: "Load-in discipline",
          body: "Tighter load-in schedules cut setup time by 18%.",
        },
      ],
      metrics: [
        { label: "Cities launched", value: "9" },
        { label: "Vendors onboarded", value: "140+" },
      ],
      pullQuote: "Every city felt like home turf by day two.",
      ctaLabel: "View ops profile",
      ctaHref: "/founders/vijay",
    },
  },
  {
    id: "founder-niyathi",
    name: "Niyathi",
    title: "Co-Founder, ICE 2.0 (IGE)",
    era: "ICE 2.0",
    focus: "Hybrid product, media pods, live streaming",
    image:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&auto=format&fit=crop&q=80",
    highlight:
      "Launched IGE, blending on-ground showcases with real-time digital broadcasts.",
    href: "/founders/founder-niyathi",
    social: { linkedin: "https://linkedin.com/in/niyathi" },
    detail: {
      headline: "Hybrid-first production",
      summary:
        "Media pods and streaming grids turned on-ground moments into digital reach.",
      heroImage:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=1200&auto=format&fit=crop&q=80",
      highlights: [
        {
          title: "Media pod network",
          body: "Built distributed pods to clip and stream in near real-time.",
        },
        {
          title: "Digital-first cues",
          body: "Stage cues aligned with live overlays and lower-thirds.",
        },
      ],
      metrics: [
        { label: "Live reach", value: "2.5M" },
        { label: "Clips delivered", value: "480" },
      ],
      pullQuote: "On-ground energy, digital scale.",
      ctaLabel: "View hybrid profile",
      ctaHref: "/founders/niyathi",
    },
  },
  {
    id: "founder-vishnu",
    name: "Vishnu",
    title: "Co-Founder, ICE 2.0 (IGN)",
    era: "ICE 2.0",
    focus: "Partner network, digital attendee journey",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&auto=format&fit=crop&q=80",
    highlight:
      "Built IGN’s partner network and data-driven attendee routes for hybrid editions.",
    href: "/founders/founder-vishnu",
    social: { linkedin: "https://linkedin.com/in/vishnu" },
    detail: {
      headline: "Partner network at scale",
      summary:
        "Data-driven attendee routing improved conversions for partners.",
      heroImage:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1200&auto=format&fit=crop&q=80",
      highlights: [
        {
          title: "Partner graph",
          body: "Mapped partner categories to attendee intent signals.",
        },
        {
          title: "Route design",
          body: "Dynamic routes increased qualified visits per booth.",
        },
      ],
      metrics: [
        { label: "Partners onboarded", value: "220" },
        { label: "Qualified visits", value: "+34%" },
      ],
      pullQuote: "Every route was designed to convert.",
      ctaLabel: "View partner playbook",
      ctaHref: "/founders/vishnu",
    },
  },
  {
    id: "founder-rhea",
    name: "Rhea Menon",
    title: "Chief Experience Officer",
    era: "ICE 2.0",
    focus: "Guest journey, hospitality, premium lounges",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=80",
    highlight:
      "Redesigned guest journey with premium lounges and hospitality playbooks.",
    href: "/founders/founder-rhea",
    social: { linkedin: "https://linkedin.com/in/rheamenon" },
    detail: {
      headline: "Hospitality as product",
      summary:
        "Lounges, wayfinding, and service scripts lifted NPS across venues.",
      heroImage:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&auto=format&fit=crop&q=80",
      highlights: [
        {
          title: "Service scripts",
          body: "Unified scripts for hosts across all venues.",
        },
        {
          title: "Wayfinding OS",
          body: "Signage + app routing reduced lost time for guests.",
        },
      ],
      metrics: [
        { label: "NPS lift", value: "+18" },
        { label: "Avg dwell", value: "7.5h" },
      ],
      pullQuote: "Hospitality became part of the show.",
    },
  },
  {
    id: "founder-kabir",
    name: "Kabir Shah",
    title: "Chief Technology Officer",
    era: "ICE 2.0",
    focus: "Infra, telemetry, automation",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80",
    highlight:
      "Instrumented venues with telemetry and automated status dashboards.",
    href: "/founders/founder-kabir",
    social: { linkedin: "https://linkedin.com/in/kabirshah" },
    detail: {
      headline: "Telemetry-first venues",
      summary:
        "Live dashboards exposed energy, queue, and stage health in real time.",
      heroImage:
        "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&auto=format&fit=crop&q=80",
      highlights: [
        {
          title: "Live dashboards",
          body: "Ops ran from live telemetry—queues, power, media health.",
        },
        {
          title: "Automation",
          body: "Alerts and runbooks automated 70% of issue handling.",
        },
      ],
      metrics: [
        { label: "Incidents auto-resolved", value: "70%" },
        { label: "Downtime", value: "-22%" },
      ],
    },
  },
];

const run = async () => {
  try {
    const db = await getDb();
    const col = db.collection<Founder>("founders_list");
    await col.deleteMany({});
    const now = new Date();
    await col.insertMany(
      founders.map((f) => ({ ...f, createdAt: now, updatedAt: now })),
    );
    console.log(`Seeded ${founders.length} founders.`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

run();
