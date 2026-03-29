import fs from "fs";
import path from "path";
import {
  validateStory,
  validateDiagrams,
  validateCurriculum,
  validateGlossary,
} from "./lib/validation";

const CONTENT_DIR = path.join(process.cwd(), "content");
const DRAFTS_DIR = path.join(CONTENT_DIR, "drafts");

type ContentType = "story" | "diagram" | "curriculum" | "glossary";

const TYPE_DIR_MAP: Record<ContentType, string> = {
  story: "stories",
  diagram: "diagrams",
  curriculum: "curriculum",
  glossary: "glossary",
};

const TYPE_VALIDATOR_MAP: Record<ContentType, (data: unknown) => { valid: boolean; errors: string[] }> = {
  story: validateStory,
  diagram: validateDiagrams,
  curriculum: validateCurriculum,
  glossary: validateGlossary,
};

function promoteFile(type: ContentType, slug: string): boolean {
  const draftDir = path.join(DRAFTS_DIR, TYPE_DIR_MAP[type]);
  const draftPath = path.join(draftDir, `${slug}.json`);

  if (!fs.existsSync(draftPath)) {
    console.error(`Draft not found: ${draftPath}`);
    return false;
  }

  const data = JSON.parse(fs.readFileSync(draftPath, "utf-8"));
  const result = TYPE_VALIDATOR_MAP[type](data);

  if (!result.valid) {
    console.error(`Validation failed for ${slug}:`);
    for (const error of result.errors) {
      console.error(`  - ${error}`);
    }
    console.error(`\nFix the errors and try again.`);
    return false;
  }

  const liveDir = path.join(CONTENT_DIR, TYPE_DIR_MAP[type]);
  fs.mkdirSync(liveDir, { recursive: true });

  if (type === "glossary") {
    // Merge new terms into existing glossary
    const livePath = path.join(liveDir, "terms.json");
    let existingTerms: Record<string, unknown>[] = [];
    if (fs.existsSync(livePath)) {
      existingTerms = JSON.parse(fs.readFileSync(livePath, "utf-8"));
    }

    const newTerms = data as Record<string, unknown>[];
    const existingIds = new Set(existingTerms.map((t) => t.id));

    let added = 0;
    let updated = 0;
    for (const term of newTerms) {
      if (existingIds.has(term.id)) {
        // Replace existing term
        const idx = existingTerms.findIndex((t) => t.id === term.id);
        existingTerms[idx] = term;
        updated++;
      } else {
        existingTerms.push(term);
        added++;
      }
    }

    fs.writeFileSync(livePath, JSON.stringify(existingTerms, null, 2) + "\n");
    console.log(`Glossary: ${added} terms added, ${updated} terms updated -> ${livePath}`);
  } else {
    const livePath = path.join(liveDir, `${slug}.json`);
    fs.copyFileSync(draftPath, livePath);
    console.log(`Promoted: ${draftPath} -> ${livePath}`);
  }

  return true;
}

function promoteAll(): boolean {
  let allPassed = true;
  const types: ContentType[] = ["story", "diagram", "curriculum", "glossary"];

  for (const type of types) {
    const draftDir = path.join(DRAFTS_DIR, TYPE_DIR_MAP[type]);
    if (!fs.existsSync(draftDir)) continue;

    const files = fs.readdirSync(draftDir).filter((f) => f.endsWith(".json"));
    for (const file of files) {
      const slug = file.replace(".json", "");
      if (!promoteFile(type, slug)) {
        allPassed = false;
      }
    }
  }

  return allPassed;
}

// CLI
const args = process.argv.slice(2);

if (args.includes("--all")) {
  console.log("\nPromoting all valid drafts...\n");
  const success = promoteAll();
  process.exit(success ? 0 : 1);
}

const type = args[0] as ContentType;
const slug = args[1];

if (!type || !Object.keys(TYPE_DIR_MAP).includes(type)) {
  console.error(`Usage: npx tsx scripts/promote.ts <type> <slug>`);
  console.error(`       npx tsx scripts/promote.ts --all`);
  console.error(`\nTypes: story, diagram, curriculum, glossary`);
  console.error(`\nExamples:`);
  console.error(`  npx tsx scripts/promote.ts story social-media-feed`);
  console.error(`  npx tsx scripts/promote.ts glossary new-terms`);
  console.error(`  npx tsx scripts/promote.ts --all`);
  process.exit(1);
}

if (!slug) {
  console.error(`Please provide a slug. Example: npx tsx scripts/promote.ts ${type} my-content`);
  process.exit(1);
}

console.log(`\nPromoting ${type}: ${slug}...\n`);
const success = promoteFile(type, slug);
process.exit(success ? 0 : 1);
