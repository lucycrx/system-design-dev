import {
  getStoryExample,
  getDiagramExample,
  getCurriculumExample,
  getGlossaryExample,
  getTypesAsText,
} from "./examples";

interface Prompt {
  system: string;
  user: string;
}

export function buildStoryPrompt(brief: string): Prompt {
  const types = getTypesAsText();
  const example = getStoryExample();

  return {
    system: `You are a content author for a system design learning platform aimed at PMs and non-engineers.

## Output Format
Return ONLY valid JSON matching the Story interface. No markdown fences, no commentary, no extra text.

## TypeScript Types (your JSON must conform to these exactly)
${types}

## Style Guide
- Write in second person ("You just built...")
- Use real-world analogies to explain every concept (restaurants, libraries, phone calls, etc.)
- Use [[glossary:term-id|display text]] syntax for inline glossary links. term-id should be kebab-case.
- Each story has exactly 3 stages showing system scaling (small -> medium -> large user counts)
- Stages follow: setup (what's happening), problem (what breaks), resolution (how to fix it). Stage 1 can have null problem/resolution.
- Include a mix of block types: text, callout (analogy/insight/warning/tip), diagram, checkpoint, challenge, reveal
- Checkpoints have 3 options with exactly 1 correct. Each option has a teaching explanation.
- Challenges have 3 options with exactly 1 correct, plus a scenario and explanations.
- id and slug should be kebab-case derived from the title
- Do NOT use emojis anywhere
- DiagramBlock diagramId values should follow the pattern: {story-slug}-stage-{n}
- suggestedQuestions at the end of each stage (3 questions)
- estimatedMinutes should be realistic (15-30 for a full story)

## Example (follow this style, structure, and depth closely)
${example}`,
    user: `Generate a complete story JSON for the following topic:\n\n${brief}`,
  };
}

export function buildDiagramPrompt(brief: string, storyJson?: string): Prompt {
  const types = getTypesAsText();
  const example = getDiagramExample();

  const storyContext = storyJson
    ? `\n\n## Story JSON (generate diagrams matching the DiagramBlock references in this story)\n${storyJson}`
    : "";

  return {
    system: `You generate architecture diagram data for a system design learning platform.

## Output Format
Return ONLY valid JSON as a Record<string, Diagram>. Keys are diagram IDs referenced by story DiagramBlock.diagramId values. No markdown fences, no commentary.

## TypeScript Types
${types}

## Layout Guidelines
- Nodes use position: { x, y } coordinates
- Space nodes at least 200px apart horizontally, 150px vertically
- Use reasonable coordinates (x: 0-800, y: 0-400)
- Node types: client, server, database, cache, queue, load-balancer, cdn, api-gateway
- Use isNew: true for nodes introduced in later stages (not present in earlier stages)
- Edge id format: e-{source}-{target} (must be unique)
- Edge labels should be short (2-4 words)
- Each diagram should have a unique id matching its key in the record

## Example
${example}${storyContext}`,
    user: `Generate diagram JSON for: ${brief}`,
  };
}

export function buildCurriculumPrompt(brief: string): Prompt {
  const types = getTypesAsText();
  const example = getCurriculumExample();

  return {
    system: `You are a content author for a system design learning platform aimed at PMs and non-engineers.

## Output Format
Return ONLY valid JSON matching the CurriculumModule interface. No markdown fences, no commentary.

## TypeScript Types
${types}

## Style Guide
- Each lesson follows the "What -> Why -> How -> When" section structure
- "what" sections define the concept clearly
- "why" sections explain why PMs/builders should care
- "how" sections use real-world analogies
- "when" sections give practical application guidance
- Quiz questions should test understanding with realistic scenarios (3 options, 1 correct)
- Use [[glossary:term-id|display text]] syntax for inline glossary links
- Lesson estimatedMinutes: 4-8 per lesson
- Do NOT use emojis except in the module icon field (which requires exactly one emoji)
- color must be one of: accent, blue, green, orange, pink, purple
- relatedStories should reference existing story slugs where applicable
- relatedGlossary should list relevant glossary term IDs

## Example (follow this style and depth)
${example}`,
    user: `Generate a complete curriculum module JSON for:\n\n${brief}`,
  };
}

export function buildGlossaryPrompt(brief: string): Prompt {
  const types = getTypesAsText();
  const example = getGlossaryExample();

  return {
    system: `You generate glossary terms for a system design learning platform aimed at PMs and non-engineers.

## Output Format
Return ONLY a valid JSON array of GlossaryTerm objects. No markdown fences, no commentary.

## TypeScript Types
${types}

## Style Guide
- shortDefinition: 1-2 sentences, clear and jargon-free
- analogy: a vivid, real-world comparison (restaurants, libraries, phone calls, etc.)
- id should be kebab-case
- relatedConcepts should reference other glossary term IDs
- firstAppearance is optional — include if you know which story/stage introduces it
- Do NOT use emojis

## Existing Terms (avoid duplicates, use consistent style)
${example}`,
    user: `Generate glossary terms for the following concepts:\n\n${brief}`,
  };
}
