---
name: diagram-design
description: Design and generate interactive architecture diagrams for Build Stories. Produces ReactFlow-compatible JSON with a warm schematic visual language — category colors, stroke icons, plain-English labels, and layered layouts.
allowed-tools: Read, Grep, Glob, Write, Edit, Agent
---

# Diagram Design

Design and generate interactive architecture diagrams for Build Stories on the System Design School website. Diagrams use ReactFlow and follow a warm, schematic visual language derived from the architecture-review skill.

## Triggers

- `/diagram-design`
- "design the diagram for"
- "create a diagram"
- "update the diagram"
- "add to the diagram"
- "diagram for stage"

## Instructions

You design architecture diagrams that teach system design concepts through visual storytelling. Each diagram accompanies a Build Story stage and should make the architecture **immediately legible to someone who has never seen a system diagram before**.

### Voice and tone

- **Plain English labels.** "Your Browser" not "Client Application". "Database" not "RDBMS Instance".
- **Explanations for everyone.** Write node explanations for someone who manages engineers, not someone who is one.
- **Scale-aware naming.** Early stages use friendly names ("Your Browser", "Server"). Later stages use precise names ("Load Balancer", "Redis Cache") as the reader's vocabulary grows.
- **No emojis.** Use text labels, icons, and color to communicate — never emoji.

### Output format

Diagrams are stored as JSON in `/content/diagrams/{story-slug}.json`. Each file is a map of diagram IDs to diagram objects.

```json
{
  "story-slug-stage-N": {
    "id": "story-slug-stage-N",
    "nodes": [DiagramNode, ...],
    "edges": [DiagramEdge, ...]
  }
}
```

**DiagramNode:**
```json
{
  "id": "unique-node-id",
  "type": "client | server | database | cache | queue | load-balancer | cdn | api-gateway | auth | external-service | background-job | storage | agent",
  "label": "Human-readable name",
  "position": { "x": 0, "y": 0 },
  "explanation": "Plain-English description of what this component does",
  "glossaryLink": "optional-glossary-term-id",
  "isNew": false
}
```

**DiagramEdge:**
```json
{
  "id": "unique-edge-id",
  "source": "source-node-id",
  "target": "target-node-id",
  "label": "short action verb phrase",
  "animated": false,
  "style": "solid | dashed"
}
```

### Visual design language

The diagrams follow a **warm schematic aesthetic** — clean, institutional, approachable. This section defines the visual rules that the React components enforce. When designing diagram data, keep these in mind so the output renders well.

#### Category colors

Each node type maps to a category color. These are defined in the site's design system and applied by the `SystemNode` component:

| Node type | Category | Color | Hex |
|-----------|----------|-------|-----|
| `client` | Frontend | Muted steel blue | `#4A708E` |
| `server` | Server | Slate gray | `#4E5E6E` |
| `api-gateway` | API Layer | Slate gray | `#4E5E6E` |
| `database` | Database | Forest green | `#256B3B` |
| `cache` | Cache | Warm gold | `#C49A1D` |
| `auth` | Auth | Deep red | `#8C3B3B` |
| `external-service` | External | Deep teal | `#2A7A6B` |
| `queue`, `background-job` | Background Jobs | Muted purple | `#6B5B8A` |
| `load-balancer`, `cdn` | Infrastructure | Steel blue | `#4A708E` |
| `storage` | Storage | Sage green | `#5A7A5A` |
| `agent` | Agent | Slate gray | `#4E5E6E` |

These colors are warm, muted, and institutional — not primary/saturated. They provide visual distinction without competing for attention.

#### Icons

Each node type has a **16px stroke-based icon** (Lucide style) rendered inline by `SystemNode.tsx`. Icons use `currentColor` and `strokeWidth={1.5}` for a clean, schematic feel. The icon set:

- `client` — Monitor (screen with stand)
- `server` — Stacked racks with indicator dots
- `database` — Cylinder with horizontal bands
- `cache` — Lightning bolt
- `queue` — Three vertical bars with dashed connectors
- `load-balancer` — Three connected circles (tree)
- `cdn` — Globe with meridian
- `api-gateway` — Rectangle with horizontal lines on both sides
- `auth` — Shield with checkmark
- `external-service` — Plug/connector
- `background-job` — Two overlapping squares with arrow path
- `storage` — Hard drive / inbox tray
- `agent` — Brain with connection points

#### Node rendering

- **Dimensions:** 140px wide, 64px min-height
- **Layout:** Icon left, label + type sublabel right
- **Background:** White surface (`--color-surface`)
- **Border:** Subtle (`--color-border`), square corners
- **Cache nodes** get a dashed border to visually distinguish ephemeral storage
- **New nodes** (`isNew: true`) animate in with scale + fade-up (500ms)
- **Highlighted nodes** pulse with accent-colored border ring

#### Edge rendering

- **Solid edges:** Primary data flows (writes, sends, requests)
- **Dashed edges:** Secondary/read flows, fallback paths, polling
- **Animated edges:** Active data flows get a moving dot along the path (accent color, 2s cycle)
- **Labels:** Centered on edge, monospace font, semi-transparent background
- **Arrowheads:** Small polygon markers at target end

#### Canvas

- Background grid: 32px gap, subtle border-colored dots
- Zoom: 0.5x to 2x
- Auto-fit on load with 30% padding
- Fade-in transition after layout settles

### Design principles

#### 1. Progressive complexity

Build Story diagrams evolve across stages. Design each diagram as an evolution of the previous one:

- **Stage 1:** Minimal (2-3 nodes). Introduce the basic request-response flow.
- **Stage 2-3:** Add components as scaling problems emerge. Mark new nodes with `isNew: true`.
- **Later stages:** Full architecture with 6-10+ nodes. Use all relevant node types.

Each new node should feel like a **natural answer** to the problem described in the story narrative.

#### 2. Spatial layout

Position nodes to communicate architecture layers and data flow direction:

- **Left-to-right flow:** Clients on the left, backends in the middle, data stores on the right
- **Top-to-bottom for vertical flows:** Entry points at top, storage at bottom
- **Group related nodes:** Keep nodes that communicate frequently close together
- **Consistent spacing:** ~200-300px between horizontal neighbors, ~150-200px between vertical layers
- **Avoid diagonal-only layouts:** Prefer clear horizontal or vertical alignment with occasional offsets

**Layout grid guidance:**
```
x: 0      x: 300    x: 600    x: 900
y: 0    [client]   [gateway]  [external]
y: 200  [client]   [server]   [cache]
y: 400             [database] [storage]
```

#### 3. Node labels

- **Early stages:** Friendly, conversational. "Your Browser", "The Server", "Friend's Browser"
- **Later stages:** Precise, technical. "Load Balancer", "Redis Cache", "PostgreSQL"
- **Keep labels short** — 2-3 words max. The type sublabel provides additional context.
- **Use "the" or "your" in early stages** to make it personal and relatable

#### 4. Edge labels

- **5-6 words max.** These render small, centered on the edge path.
- **Use active verbs:** "send message", "write to disk", "read history", "check session"
- **Be specific:** "store message" not "send data". "read user profile" not "query".
- **Distinguish directions:** Use "write" vs "read", "send" vs "receive", "push" vs "pull"

#### 5. Explanations

Node explanations appear in tooltips on hover/click. Write them for a non-technical audience:

- **Start with what it does**, not what it is: "Receives all incoming messages and forwards them to the right person" not "A WebSocket server application"
- **Relate to the story:** "The database that permanently stores all messages on disk — survives server restarts"
- **Use analogies sparingly** — one per explanation at most
- **One to two sentences.** Tooltips are small.

#### 6. Animation and highlighting

Use `animateFlow` and `highlightNodes` in DiagramBlock references to guide attention:

- **animateFlow:** Array of node IDs tracing a data path. Edges between consecutive nodes get animated dots. Use to show "how a message travels through the system."
- **highlightNodes:** Array of node IDs to pulse. Use to draw attention to newly introduced or currently discussed components.

### Workflow

When asked to design or update a diagram:

1. **Read the story context.** Understand the stage narrative — what problem is being introduced? What component solves it?
2. **Read the existing diagrams.** If this is stage N, read stages 1 through N-1 to understand the progression.
3. **Read the component taxonomy** at `.claude/skills/diagram-design/component-taxonomy.json` for category definitions, descriptions, and analogies.
4. **Design the diagram JSON.** Follow the principles above. For updates to existing diagrams, preserve node IDs and positions of unchanged components.
5. **Write the JSON** to `/content/diagrams/{story-slug}.json`, merging with existing diagrams in that file.
6. **Verify the story references.** Ensure any DiagramBlock in the story's stage has a matching `diagramId` in the diagrams file.

### Data quality checklist

Before writing diagram JSON, verify:

- [ ] Every `edge.source` and `edge.target` matches a `node.id` in the same diagram
- [ ] Every edge has a unique `id` (convention: `e-{source}-{target}` or `e-{source}-{target}-{verb}` for parallel edges)
- [ ] Node positions don't overlap (minimum ~150px between centers)
- [ ] New components added in this stage have `isNew: true`
- [ ] Explanations are plain English, 1-2 sentences, starting with what the component does
- [ ] Edge labels are 5-6 words max with active verbs
- [ ] The diagram tells a coherent visual story that matches the stage narrative
