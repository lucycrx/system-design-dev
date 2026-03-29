import fs from "fs";
import path from "path";
import { generate, extractJSON } from "./lib/anthropic";
import {
  buildStoryPrompt,
  buildDiagramPrompt,
  buildCurriculumPrompt,
  buildGlossaryPrompt,
} from "./lib/prompts";

const DRAFTS_DIR = path.join(process.cwd(), "content", "drafts");

const CONTENT_TYPES = ["story", "diagram", "curriculum", "glossary"] as const;
type ContentType = (typeof CONTENT_TYPES)[number];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

function getOutputDir(type: ContentType): string {
  const dirMap: Record<ContentType, string> = {
    story: "stories",
    diagram: "diagrams",
    curriculum: "curriculum",
    glossary: "glossary",
  };
  return path.join(DRAFTS_DIR, dirMap[type]);
}

async function generateContent(type: ContentType, brief: string, options: { forStory?: string }) {
  console.log(`\nGenerating ${type}...`);
  console.log(`Brief: ${brief}\n`);

  let prompt: { system: string; user: string };

  switch (type) {
    case "story":
      prompt = buildStoryPrompt(brief);
      break;
    case "diagram": {
      let storyJson: string | undefined;
      if (options.forStory) {
        // Try drafts first, then live content
        const draftPath = path.join(DRAFTS_DIR, "stories", `${options.forStory}.json`);
        const livePath = path.join(process.cwd(), "content", "stories", `${options.forStory}.json`);
        if (fs.existsSync(draftPath)) {
          storyJson = fs.readFileSync(draftPath, "utf-8");
          console.log(`Using draft story: ${draftPath}`);
        } else if (fs.existsSync(livePath)) {
          storyJson = fs.readFileSync(livePath, "utf-8");
          console.log(`Using live story: ${livePath}`);
        } else {
          console.error(`Story "${options.forStory}" not found in drafts or content.`);
          process.exit(1);
        }
      }
      prompt = buildDiagramPrompt(brief, storyJson);
      break;
    }
    case "curriculum":
      prompt = buildCurriculumPrompt(brief);
      break;
    case "glossary":
      prompt = buildGlossaryPrompt(brief);
      break;
  }

  console.log("Calling Claude API...");
  const rawResponse = await generate(prompt.system, prompt.user);
  const jsonStr = extractJSON(rawResponse);

  // Parse to validate it's valid JSON
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonStr);
  } catch (e) {
    console.error("\nFailed to parse JSON response. Raw output:\n");
    console.error(rawResponse);
    process.exit(1);
  }

  // Determine output filename
  let slug: string;
  if (type === "glossary") {
    slug = "new-terms";
  } else if (type === "diagram" && options.forStory) {
    slug = options.forStory;
  } else if (typeof parsed === "object" && parsed !== null && "slug" in parsed) {
    slug = (parsed as Record<string, string>).slug;
  } else {
    slug = slugify(brief.slice(0, 60));
  }

  const outputDir = getOutputDir(type);
  fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, `${slug}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(parsed, null, 2) + "\n");

  console.log(`\nGenerated: ${outputPath}`);
  console.log(`\nNext steps:`);
  console.log(`  1. Review and edit the JSON in your editor`);
  console.log(`  2. Run: npm run validate`);
  console.log(`  3. Run: npm run promote -- ${type} ${slug}`);
}

// CLI
const args = process.argv.slice(2);
const type = args[0] as ContentType;

if (!type || !CONTENT_TYPES.includes(type)) {
  console.error(`Usage: npx tsx scripts/generate.ts <type> [brief]`);
  console.error(`Types: ${CONTENT_TYPES.join(", ")}`);
  console.error(`\nExamples:`);
  console.error(`  npx tsx scripts/generate.ts story "A social media feed scaling from MVP to millions"`);
  console.error(`  npx tsx scripts/generate.ts diagram --for-story social-media-feed`);
  console.error(`  npx tsx scripts/generate.ts curriculum "Scaling 101: caching, load balancing, CDNs"`);
  console.error(`  npx tsx scripts/generate.ts glossary "cdn, cache, load-balancer, horizontal-scaling"`);
  process.exit(1);
}

// Parse --for-story flag
let forStory: string | undefined;
const forStoryIdx = args.indexOf("--for-story");
if (forStoryIdx !== -1) {
  forStory = args[forStoryIdx + 1];
  args.splice(forStoryIdx, 2);
}

const brief = args.slice(1).join(" ");
if (!brief && !forStory) {
  console.error(`Please provide a brief or --for-story flag.`);
  process.exit(1);
}

generateContent(type, brief || `Generate diagrams for story: ${forStory}`, { forStory });
