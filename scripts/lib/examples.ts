import fs from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "content");

export function getStoryExample(): string {
  return fs.readFileSync(path.join(CONTENT_DIR, "stories", "chat-app.json"), "utf-8");
}

export function getDiagramExample(): string {
  return fs.readFileSync(path.join(CONTENT_DIR, "diagrams", "chat-app.json"), "utf-8");
}

export function getCurriculumExample(): string {
  return fs.readFileSync(path.join(CONTENT_DIR, "curriculum", "the-basics.json"), "utf-8");
}

export function getGlossaryExample(): string {
  return fs.readFileSync(path.join(CONTENT_DIR, "glossary", "terms.json"), "utf-8");
}

export function getTypesAsText(): string {
  return fs.readFileSync(path.join(process.cwd(), "types", "story.ts"), "utf-8");
}
