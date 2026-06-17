// ---- Block types (the building blocks of a stage) ----

export interface TextBlock {
  type: "text";
  content: string; // Markdown with [[glossary:term-id|display text]] links
}

export interface DiagramBlock {
  type: "diagram";
  diagramId: string;
  caption?: string;
  highlightNodes?: string[];
  animateFlow?: string[];
}

export interface CalloutBlock {
  type: "callout";
  style: "insight" | "analogy" | "warning" | "tip";
  content: string;
}

export interface CheckpointBlock {
  type: "checkpoint";
  question: string;
  options: {
    id: string;
    text: string;
    correct: boolean;
    explanation: string;
  }[];
}

export interface ChallengeBlock {
  type: "challenge";
  scenario: string;
  question: string;
  options: {
    id: string;
    text: string;
    correct: boolean;
    explanation: string;
    conceptLink?: string;
  }[];
}

export interface RevealBlock {
  type: "reveal";
  label: string; // Button text, e.g. "Want to go deeper?"
  content: string; // Markdown
}

export interface TradeoffOption {
  name: string; // Short name of the option, e.g. "Cache aggressively"
  pros: string[]; // What you gain
  cons: string[]; // What you give up
}

export interface TradeoffBlock {
  type: "tradeoff";
  decision: string; // The fork in the road, phrased as a question
  options: TradeoffOption[]; // 2-3 competing approaches
  choice: string; // Markdown: what this story chose, why, and what it traded away
}

export type Block =
  | TextBlock
  | DiagramBlock
  | CalloutBlock
  | CheckpointBlock
  | ChallengeBlock
  | RevealBlock
  | TradeoffBlock;

// ---- Stage and Story ----

export interface StageNarrative {
  setup: string;
  problem: string | null;
  resolution: string | null;
}

export interface Stage {
  id: string;
  title: string;
  userScale: string;
  narrative: StageNarrative;
  blocks: Block[];
  suggestedQuestions?: string[];
}

export interface Story {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  coverImage?: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedMinutes: number;
  concepts: string[];
  prerequisites: string[];
  stages: Stage[];
  layout?: "inline" | "scrollytelling";
}

// ---- Glossary / Concepts ----

export type ConceptCategory =
  | "foundations"
  | "performance"
  | "data"
  | "reliability"
  | "realtime"
  | "architecture"
  | "networking";

export type ConceptVisualKey =
  | "waves"
  | "distribute"
  | "pulse"
  | "orbit"
  | "flow"
  | "grow"
  | "mirror"
  | "grid"
  | "converge"
  | "gate"
  | "split"
  | "curve";

/** Fixed, ordered section headings for a concept deep dive. */
export type ConceptSectionHeading =
  | "how-it-works"
  | "why-it-matters" // the "so what"
  | "trade-offs"
  | "how-it-connects" // how it interfaces with other components
  | "in-practice"; // real technologies / examples

/**
 * One labeled section of a concept deep dive. Reuses the story `Block` union so
 * text, callouts, reveals, and inline diagrams render through existing components.
 */
export interface ConceptSection {
  heading: ConceptSectionHeading;
  blocks: Block[];
}

export interface GlossaryTerm {
  id: string;
  term: string;
  shortDefinition: string;
  analogy: string;
  relatedConcepts: string[];
  firstAppearance?: {
    storyId: string;
    stageId: string;
  };
  /** Optional richer article: ordered labeled sections with embedded blocks. */
  deepDive?: ConceptSection[];
  /** Optional end-of-article knowledge check. Same shape as a curriculum quiz. */
  quiz?: Lesson["quiz"];
  /** Populated by the content loader from lib/conceptMeta.ts */
  category: ConceptCategory;
  /** Populated by the content loader from lib/conceptMeta.ts */
  visual: ConceptVisualKey;
}

// ---- Curriculum ----

export interface LessonSection {
  heading: "what" | "why" | "how" | "when";
  content: string; // Markdown with glossary links
}

export interface Lesson {
  id: string;
  title: string;
  topicLabel?: string;
  description: string;
  estimatedMinutes: number;
  sections: LessonSection[];
  quiz: {
    question: string;
    scenario: string;
    options: {
      id: string;
      text: string;
      correct: boolean;
      explanation: string;
    }[];
  };
  relatedStories?: {
    storySlug: string;
    stageId: string;
    label: string; // e.g. "See this in action: Building a Chat App → Stage 2"
  }[];
  relatedGlossary?: string[]; // glossary term IDs
}

export interface CurriculumModule {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  moduleNumber: number;
  icon: string; // emoji
  color: "accent" | "blue" | "green" | "orange" | "pink" | "purple";
  lessons: Lesson[];
}

// ---- Diagram ----

export type DiagramNodeType =
  | "client"
  | "server"
  | "database"
  | "cache"
  | "queue"
  | "load-balancer"
  | "cdn"
  | "api-gateway"
  | "auth"
  | "external-service"
  | "background-job"
  | "storage"
  | "agent";

export interface DiagramNode {
  id: string;
  type: DiagramNodeType;
  label: string;
  position: { x: number; y: number };
  explanation: string;
  glossaryLink?: string;
  isNew?: boolean;
  technology?: string;
}

export interface DiagramEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
  style?: "solid" | "dashed";
  protocol?: string;
}

export interface Diagram {
  id: string;
  title?: string;
  description?: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}
