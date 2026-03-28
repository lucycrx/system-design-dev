import fs from "fs";
import path from "path";
import type { Story, GlossaryTerm, CurriculumModule } from "@/types/story";

const CONTENT_DIR = path.join(process.cwd(), "content");

export function getStory(slug: string): Story | null {
  const filePath = path.join(CONTENT_DIR, "stories", `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

export function getAllStories(): Story[] {
  const storiesDir = path.join(CONTENT_DIR, "stories");
  if (!fs.existsSync(storiesDir)) return [];
  return fs
    .readdirSync(storiesDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(storiesDir, f), "utf-8")));
}

export function getGlossaryTerms(): GlossaryTerm[] {
  const filePath = path.join(CONTENT_DIR, "glossary", "terms.json");
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

export function getGlossaryTerm(id: string): GlossaryTerm | undefined {
  return getGlossaryTerms().find((t) => t.id === id);
}

export function getGlossaryMap(): Record<string, GlossaryTerm> {
  const terms = getGlossaryTerms();
  return Object.fromEntries(terms.map((t) => [t.id, t]));
}

// ---- Curriculum ----

export function getModule(slug: string): CurriculumModule | null {
  const filePath = path.join(CONTENT_DIR, "curriculum", `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

export function getAllModules(): CurriculumModule[] {
  const curriculumDir = path.join(CONTENT_DIR, "curriculum");
  if (!fs.existsSync(curriculumDir)) return [];
  return fs
    .readdirSync(curriculumDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) =>
      JSON.parse(fs.readFileSync(path.join(curriculumDir, f), "utf-8"))
    )
    .sort((a, b) => a.moduleNumber - b.moduleNumber);
}
