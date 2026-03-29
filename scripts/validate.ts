import fs from "fs";
import path from "path";
import {
  validateStory,
  validateDiagrams,
  validateCurriculum,
  validateGlossary,
} from "./lib/validation";

const DRAFTS_DIR = path.join(process.cwd(), "content", "drafts");

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

function getFilesForType(type: ContentType): string[] {
  const dir = path.join(DRAFTS_DIR, TYPE_DIR_MAP[type]);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => path.join(dir, f));
}

function validateFile(filePath: string, type: ContentType): boolean {
  const relativePath = path.relative(process.cwd(), filePath);
  let data: unknown;

  try {
    data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    console.error(`  FAIL  ${relativePath} — invalid JSON`);
    return false;
  }

  const validator = TYPE_VALIDATOR_MAP[type];
  const result = validator(data);

  if (result.valid) {
    console.log(`  PASS  ${relativePath}`);
  } else {
    console.error(`  FAIL  ${relativePath}`);
    for (const error of result.errors) {
      console.error(`        - ${error}`);
    }
  }

  return result.valid;
}

// CLI
const args = process.argv.slice(2);
const filterType = args[0] as ContentType | undefined;

if (filterType && !Object.keys(TYPE_DIR_MAP).includes(filterType)) {
  console.error(`Usage: npx tsx scripts/validate.ts [type]`);
  console.error(`Types: story, diagram, curriculum, glossary`);
  console.error(`Omit type to validate all drafts.`);
  process.exit(1);
}

const types: ContentType[] = filterType
  ? [filterType]
  : (Object.keys(TYPE_DIR_MAP) as ContentType[]);

let totalFiles = 0;
let totalPassed = 0;

console.log("\nValidating drafts...\n");

for (const type of types) {
  const files = getFilesForType(type);
  if (files.length === 0) continue;

  console.log(`${type}:`);
  for (const file of files) {
    totalFiles++;
    if (validateFile(file, type)) totalPassed++;
  }
  console.log("");
}

if (totalFiles === 0) {
  console.log("No draft files found in content/drafts/");
  process.exit(0);
}

console.log(`\n${totalPassed}/${totalFiles} files passed validation.`);
process.exit(totalPassed === totalFiles ? 0 : 1);
