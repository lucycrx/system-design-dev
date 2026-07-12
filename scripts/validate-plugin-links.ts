/**
 * Validates that every learn-more link in the architecture-review plugin's
 * risk-patterns.json points at content that actually exists on this site:
 *   - fix.relatedGlossary[]  -> a term id in content/glossary/terms.json
 *   - fix.relatedStory       -> a story slug + stage id in content/stories/*.json
 *
 * Run:  npm run validate:plugin
 * Override the plugin location with PLUGIN_DIR=/path/to/architecture-review-plugin
 * Exits non-zero on any broken reference so CI / pre-push can catch drift.
 */
import fs from "fs";
import path from "path";

const SITE_DIR = process.cwd();
const PLUGIN_DIR =
  process.env.PLUGIN_DIR ??
  path.resolve(SITE_DIR, "..", "architecture-review-plugin");

const RISK_PATTERNS = path.join(
  PLUGIN_DIR,
  "skills",
  "architecture-review",
  "risk-patterns.json"
);

interface RelatedStory {
  storySlug: string;
  stageId?: string;
}
interface Fix {
  relatedGlossary?: string[];
  relatedStory?: RelatedStory;
}
interface RiskPattern {
  id: string;
  fix?: Fix;
}

function loadGlossaryIds(): Set<string> {
  const p = path.join(SITE_DIR, "content", "glossary", "terms.json");
  const terms: Array<{ id: string }> = JSON.parse(fs.readFileSync(p, "utf-8"));
  return new Set(terms.map((t) => t.id));
}

function loadStoryStages(): Map<string, Set<string>> {
  const dir = path.join(SITE_DIR, "content", "stories");
  const map = new Map<string, Set<string>>();
  for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".json"))) {
    const story = JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8"));
    map.set(
      story.slug,
      new Set((story.stages ?? []).map((s: { id: string }) => s.id))
    );
  }
  return map;
}

function loadPatterns(): RiskPattern[] {
  const raw = JSON.parse(fs.readFileSync(RISK_PATTERNS, "utf-8"));
  return Array.isArray(raw) ? raw : (raw.patterns ?? raw.risks ?? []);
}

function main() {
  if (!fs.existsSync(RISK_PATTERNS)) {
    console.error(`Plugin risk-patterns.json not found at:\n  ${RISK_PATTERNS}`);
    console.error("Set PLUGIN_DIR to the architecture-review-plugin checkout.");
    process.exit(1);
  }

  const glossaryIds = loadGlossaryIds();
  const storyStages = loadStoryStages();
  const patterns = loadPatterns();
  const errors: string[] = [];

  for (const pat of patterns) {
    const fix = pat.fix;
    if (!fix) continue;

    for (const term of fix.relatedGlossary ?? []) {
      if (!glossaryIds.has(term)) {
        errors.push(`[${pat.id}] relatedGlossary "${term}" not in terms.json`);
      }
    }

    const rs = fix.relatedStory;
    if (rs) {
      const stages = storyStages.get(rs.storySlug);
      if (!stages) {
        errors.push(`[${pat.id}] relatedStory slug "${rs.storySlug}" has no story`);
      } else if (rs.stageId && !stages.has(rs.stageId)) {
        errors.push(
          `[${pat.id}] story "${rs.storySlug}" has no stage "${rs.stageId}" ` +
            `(has: ${[...stages].join(", ")})`
        );
      }
    }
  }

  if (errors.length) {
    console.error(`✗ ${errors.length} broken plugin link(s):\n`);
    for (const e of errors) console.error("  " + e);
    process.exit(1);
  }

  console.log(
    `✓ All plugin learn-more links resolve ` +
      `(${patterns.length} patterns, ${glossaryIds.size} terms, ${storyStages.size} stories).`
  );
}

main();
