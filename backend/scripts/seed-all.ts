import { spawnSync } from "child_process";
import path from "path";

type Seed = { label: string; file: string };

const tsxBin = path.resolve(__dirname, "../node_modules/.bin/tsx");
const seeds: Seed[] = [
  { label: "hero", file: "scripts/seed-hero.ts" },
  { label: "review", file: "scripts/seed-review.ts" },
  { label: "brands", file: "scripts/seed-brands.ts" },
  { label: "brands:full", file: "scripts/seed-brands-full.ts" },
  { label: "celebrities", file: "scripts/seed-celebrities.ts" },
  { label: "sellers", file: "scripts/seed-sellers.ts" },
  { label: "sellers:list", file: "scripts/seed-sellers-list.ts" },
  { label: "buyers", file: "scripts/seed-buyers.ts" },
  { label: "buyers:list", file: "scripts/seed-buyers-list.ts" },
  { label: "gallery", file: "scripts/seed-gallery.ts" },
  { label: "timeline", file: "scripts/seed-timeline.ts" },
  { label: "arches", file: "scripts/seed-arches.ts" },
  { label: "stalls", file: "scripts/seed-stalls.ts" },
  { label: "buyer-mosaic", file: "scripts/seed-buyer-mosaic.ts" },
  { label: "vvips", file: "scripts/seed-vvips.ts" },
  { label: "founders", file: "scripts/seed-founders.ts" },
  { label: "founders:list", file: "scripts/seed-founders-list.ts" },
  { label: "cofounders", file: "scripts/seed-cofounders.ts" },
  { label: "cofounders:list", file: "scripts/seed-cofounders-list.ts" },
  { label: "counts", file: "scripts/seed-counts.ts" },
  { label: "dual-cta", file: "scripts/seed-dual-cta.ts" },
  { label: "footer", file: "scripts/seed-footer.ts" },
  { label: "teams", file: "scripts/seed-teams.ts" },
  { label: "teams:list", file: "scripts/seed-teams-list.ts" },
  { label: "team-home", file: "scripts/seed-team-home.ts" },
  { label: "testimonials-home", file: "scripts/seed-testimonials-home.ts" },
  { label: "testimonials", file: "scripts/seed-testimonials.ts" },
  { label: "about", file: "scripts/seed-about.ts" },
  { label: "templates", file: "scripts/seed-templates.ts" },
];

const failures: Seed[] = [];

for (const seed of seeds) {
  console.log(`\n▶️  Seeding ${seed.label} (${seed.file})`);
  const result = spawnSync(tsxBin, [seed.file], {
  stdio: "inherit",
  cwd: path.resolve(__dirname, ".."),
  env: process.env,
  shell: process.platform === "win32", 
  });
  if (result.status !== 0) {
    failures.push(seed);
    console.error(`❌ ${seed.label} failed with code ${result.status ?? "unknown"}`);
  } else {
    console.log(`✅ ${seed.label} completed`);
  }
}

if (failures.length) {
  console.error("\nSeed run finished with errors:");
  failures.forEach((s) => console.error(` - ${s.label} (${s.file})`));
  process.exit(1);
}

console.log("\nAll seeds completed successfully.");
