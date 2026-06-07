// Runtime validators for content JSON files

type ValidationResult = { valid: boolean; errors: string[] };

function check(errors: string[], condition: boolean, msg: string) {
  if (!condition) errors.push(msg);
}

function isString(v: unknown): v is string {
  return typeof v === "string";
}

function isNumber(v: unknown): v is number {
  return typeof v === "number";
}

function isArray(v: unknown): v is unknown[] {
  return Array.isArray(v);
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

const BLOCK_TYPES = ["text", "diagram", "callout", "checkpoint", "challenge", "reveal"];
const NODE_TYPES = ["client", "server", "database", "cache", "queue", "load-balancer", "cdn", "api-gateway"];
const CALLOUT_STYLES = ["insight", "analogy", "warning", "tip"];
const DIFFICULTIES = ["beginner", "intermediate", "advanced"];
const SECTION_HEADINGS = ["what", "why", "how", "when"];
const CONCEPT_SECTION_HEADINGS = ["how-it-works", "why-it-matters", "trade-offs", "how-it-connects", "in-practice"];
const MODULE_COLORS = ["accent", "blue", "green", "orange", "pink", "purple"];

function validateQuiz(quiz: unknown, path: string, errors: string[]) {
  if (!isObject(quiz)) {
    errors.push(`${path}: quiz is not an object`);
    return;
  }
  check(errors, isString(quiz.question), `${path}: quiz missing question`);
  if (isArray(quiz.options)) {
    const correct = (quiz.options as Record<string, unknown>[]).filter((o) => o.correct === true);
    check(errors, correct.length === 1, `${path}: quiz must have exactly 1 correct option, found ${correct.length}`);
  } else {
    errors.push(`${path}: quiz missing options array`);
  }
}

function validateBlock(block: unknown, path: string, errors: string[]) {
  if (!isObject(block)) {
    errors.push(`${path}: block is not an object`);
    return;
  }
  check(errors, isString(block.type) && BLOCK_TYPES.includes(block.type), `${path}: invalid block type "${block.type}"`);

  switch (block.type) {
    case "text":
      check(errors, isString(block.content), `${path}: text block missing content`);
      break;
    case "diagram":
      check(errors, isString(block.diagramId), `${path}: diagram block missing diagramId`);
      break;
    case "callout":
      check(errors, isString(block.style) && CALLOUT_STYLES.includes(block.style as string), `${path}: invalid callout style "${block.style}"`);
      check(errors, isString(block.content), `${path}: callout block missing content`);
      break;
    case "checkpoint":
      check(errors, isString(block.question), `${path}: checkpoint missing question`);
      if (isArray(block.options)) {
        const correct = (block.options as Record<string, unknown>[]).filter((o) => o.correct === true);
        check(errors, correct.length === 1, `${path}: checkpoint must have exactly 1 correct option, found ${correct.length}`);
      } else {
        errors.push(`${path}: checkpoint missing options array`);
      }
      break;
    case "challenge":
      check(errors, isString(block.scenario), `${path}: challenge missing scenario`);
      check(errors, isString(block.question), `${path}: challenge missing question`);
      if (isArray(block.options)) {
        const correct = (block.options as Record<string, unknown>[]).filter((o) => o.correct === true);
        check(errors, correct.length === 1, `${path}: challenge must have exactly 1 correct option, found ${correct.length}`);
      } else {
        errors.push(`${path}: challenge missing options array`);
      }
      break;
    case "reveal":
      check(errors, isString(block.label), `${path}: reveal missing label`);
      check(errors, isString(block.content), `${path}: reveal missing content`);
      break;
  }
}

export function validateStory(data: unknown): ValidationResult {
  const errors: string[] = [];

  if (!isObject(data)) {
    return { valid: false, errors: ["Root is not an object"] };
  }

  check(errors, isString(data.id), "Missing id");
  check(errors, isString(data.slug), "Missing slug");
  check(errors, isString(data.title), "Missing title");
  check(errors, isString(data.subtitle), "Missing subtitle");
  check(errors, isString(data.description), "Missing description");
  check(errors, isString(data.difficulty) && DIFFICULTIES.includes(data.difficulty as string), `Invalid difficulty "${data.difficulty}"`);
  check(errors, isNumber(data.estimatedMinutes), "Missing estimatedMinutes");
  check(errors, isArray(data.concepts), "Missing concepts array");
  check(errors, isArray(data.prerequisites), "Missing prerequisites array");

  if (!isArray(data.stages)) {
    errors.push("Missing stages array");
    return { valid: false, errors };
  }

  check(errors, data.stages.length === 3, `Expected 3 stages, found ${(data.stages as unknown[]).length}`);

  for (let i = 0; i < (data.stages as unknown[]).length; i++) {
    const stage = (data.stages as unknown[])[i];
    const sp = `stages[${i}]`;
    if (!isObject(stage)) {
      errors.push(`${sp}: not an object`);
      continue;
    }
    check(errors, isString(stage.id), `${sp}: missing id`);
    check(errors, isString(stage.title), `${sp}: missing title`);
    check(errors, isString(stage.userScale), `${sp}: missing userScale`);

    if (isObject(stage.narrative)) {
      const n = stage.narrative as Record<string, unknown>;
      check(errors, isString(n.setup), `${sp}.narrative: missing setup`);
    } else {
      errors.push(`${sp}: missing narrative`);
    }

    if (isArray(stage.blocks)) {
      for (let j = 0; j < (stage.blocks as unknown[]).length; j++) {
        validateBlock((stage.blocks as unknown[])[j], `${sp}.blocks[${j}]`, errors);
      }
    } else {
      errors.push(`${sp}: missing blocks array`);
    }
  }

  return { valid: errors.length === 0, errors };
}

export function validateDiagrams(data: unknown): ValidationResult {
  const errors: string[] = [];

  if (!isObject(data)) {
    return { valid: false, errors: ["Root is not an object (expected Record<string, Diagram>)"] };
  }

  for (const [key, diagram] of Object.entries(data)) {
    const dp = `diagrams["${key}"]`;
    if (!isObject(diagram)) {
      errors.push(`${dp}: not an object`);
      continue;
    }
    check(errors, isString(diagram.id), `${dp}: missing id`);
    check(errors, diagram.id === key, `${dp}: id "${diagram.id}" doesn't match key "${key}"`);

    if (!isArray(diagram.nodes)) {
      errors.push(`${dp}: missing nodes array`);
      continue;
    }

    const nodeIds = new Set<string>();
    for (let i = 0; i < (diagram.nodes as unknown[]).length; i++) {
      const node = (diagram.nodes as unknown[])[i];
      const np = `${dp}.nodes[${i}]`;
      if (!isObject(node)) {
        errors.push(`${np}: not an object`);
        continue;
      }
      check(errors, isString(node.id), `${np}: missing id`);
      check(errors, isString(node.type) && NODE_TYPES.includes(node.type as string), `${np}: invalid type "${node.type}"`);
      check(errors, isString(node.label), `${np}: missing label`);
      check(errors, isString(node.explanation), `${np}: missing explanation`);

      if (isObject(node.position)) {
        const pos = node.position as Record<string, unknown>;
        check(errors, isNumber(pos.x), `${np}: position.x not a number`);
        check(errors, isNumber(pos.y), `${np}: position.y not a number`);
      } else {
        errors.push(`${np}: missing position {x, y}`);
      }

      if (isString(node.id)) nodeIds.add(node.id as string);
    }

    if (isArray(diagram.edges)) {
      for (let i = 0; i < (diagram.edges as unknown[]).length; i++) {
        const edge = (diagram.edges as unknown[])[i];
        const ep = `${dp}.edges[${i}]`;
        if (!isObject(edge)) {
          errors.push(`${ep}: not an object`);
          continue;
        }
        check(errors, isString(edge.id), `${ep}: missing id`);
        check(errors, isString(edge.source), `${ep}: missing source`);
        check(errors, isString(edge.target), `${ep}: missing target`);
        if (isString(edge.source)) {
          check(errors, nodeIds.has(edge.source as string), `${ep}: source "${edge.source}" not found in nodes`);
        }
        if (isString(edge.target)) {
          check(errors, nodeIds.has(edge.target as string), `${ep}: target "${edge.target}" not found in nodes`);
        }
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

export function validateCurriculum(data: unknown): ValidationResult {
  const errors: string[] = [];

  if (!isObject(data)) {
    return { valid: false, errors: ["Root is not an object"] };
  }

  check(errors, isString(data.id), "Missing id");
  check(errors, isString(data.slug), "Missing slug");
  check(errors, isString(data.title), "Missing title");
  check(errors, isNumber(data.moduleNumber), "Missing moduleNumber");
  check(errors, isString(data.color) && MODULE_COLORS.includes(data.color as string), `Invalid color "${data.color}"`);

  if (!isArray(data.lessons)) {
    errors.push("Missing lessons array");
    return { valid: false, errors };
  }

  for (let i = 0; i < (data.lessons as unknown[]).length; i++) {
    const lesson = (data.lessons as unknown[])[i];
    const lp = `lessons[${i}]`;
    if (!isObject(lesson)) {
      errors.push(`${lp}: not an object`);
      continue;
    }
    check(errors, isString(lesson.id), `${lp}: missing id`);
    check(errors, isString(lesson.title), `${lp}: missing title`);
    check(errors, isString(lesson.description), `${lp}: missing description`);
    check(errors, isNumber(lesson.estimatedMinutes), `${lp}: missing estimatedMinutes`);

    if (isArray(lesson.sections)) {
      for (let j = 0; j < (lesson.sections as unknown[]).length; j++) {
        const section = (lesson.sections as unknown[])[j];
        const sp = `${lp}.sections[${j}]`;
        if (!isObject(section)) {
          errors.push(`${sp}: not an object`);
          continue;
        }
        check(errors, isString(section.heading) && SECTION_HEADINGS.includes(section.heading as string), `${sp}: invalid heading "${section.heading}"`);
        check(errors, isString(section.content), `${sp}: missing content`);
      }
    } else {
      errors.push(`${lp}: missing sections array`);
    }

    if (isObject(lesson.quiz)) {
      const quiz = lesson.quiz as Record<string, unknown>;
      check(errors, isString(quiz.question), `${lp}.quiz: missing question`);
      check(errors, isString(quiz.scenario), `${lp}.quiz: missing scenario`);
      if (isArray(quiz.options)) {
        const correct = (quiz.options as Record<string, unknown>[]).filter((o) => o.correct === true);
        check(errors, correct.length === 1, `${lp}.quiz: must have exactly 1 correct option, found ${correct.length}`);
      } else {
        errors.push(`${lp}.quiz: missing options array`);
      }
    } else {
      errors.push(`${lp}: missing quiz`);
    }
  }

  return { valid: errors.length === 0, errors };
}

export function validateGlossary(data: unknown): ValidationResult {
  const errors: string[] = [];

  if (!isArray(data)) {
    return { valid: false, errors: ["Root is not an array"] };
  }

  for (let i = 0; i < data.length; i++) {
    const term = data[i];
    const tp = `terms[${i}]`;
    if (!isObject(term)) {
      errors.push(`${tp}: not an object`);
      continue;
    }
    check(errors, isString(term.id), `${tp}: missing id`);
    check(errors, isString(term.term), `${tp}: missing term`);
    check(errors, isString(term.shortDefinition), `${tp}: missing shortDefinition`);
    check(errors, isString(term.analogy), `${tp}: missing analogy`);
    check(errors, isArray(term.relatedConcepts), `${tp}: missing relatedConcepts array`);

    // Optional deep dive: ordered labeled sections with embedded blocks
    if (term.deepDive !== undefined) {
      if (isArray(term.deepDive)) {
        for (let j = 0; j < (term.deepDive as unknown[]).length; j++) {
          const section = (term.deepDive as unknown[])[j];
          const sp = `${tp}.deepDive[${j}]`;
          if (!isObject(section)) {
            errors.push(`${sp}: not an object`);
            continue;
          }
          check(errors, isString(section.heading) && CONCEPT_SECTION_HEADINGS.includes(section.heading as string), `${sp}: invalid heading "${section.heading}"`);
          if (isArray(section.blocks)) {
            for (let k = 0; k < (section.blocks as unknown[]).length; k++) {
              validateBlock((section.blocks as unknown[])[k], `${sp}.blocks[${k}]`, errors);
            }
          } else {
            errors.push(`${sp}: missing blocks array`);
          }
        }
      } else {
        errors.push(`${tp}: deepDive must be an array`);
      }
    }

    // Optional end-of-article knowledge check
    if (term.quiz !== undefined) {
      validateQuiz(term.quiz, tp, errors);
    }
  }

  return { valid: errors.length === 0, errors };
}
