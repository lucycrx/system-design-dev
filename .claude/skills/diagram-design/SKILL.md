---
name: diagram-design
description: Design and generate interactive architecture diagrams for Build Stories. Produces diagram JSON rendered as lightweight SVG with icon-based nodes, CSS transitions between stages, and a scrollytelling layout.
allowed-tools: Read, Grep, Glob, Write, Edit, Agent
---

# Diagram Design

Design and generate architecture diagrams for Build Stories on the System Design School website. Stories can use two rendering modes:

1. **Scrollytelling** (`layout: "scrollytelling"`): A single sticky diagram panel that smoothly morphs between stages as the user scrolls. Uses lightweight SVG with CSS `transform` and `d` transitions. This is the preferred mode for stories with progressive architecture evolution (like the chat-app story).

2. **Inline** (`layout: "inline"`): ReactFlow-based interactive diagrams rendered inline with content. Better for complex diagrams that benefit from pan/zoom.

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

- **Plain English labels.** "Client" not "Client Application". "Database" not "RDBMS Instance".
- **Explanations for everyone.** Write node explanations for someone who manages engineers, not someone who is one.
- **Consistent naming.** Use "Client" for all client nodes, "Server" for servers, "Database" for databases. Keep it simple and uniform across stages.
- **No emojis.** Use text labels, icons, and color to communicate.

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
  "label": "optional short label (use sparingly)",
  "animated": false,
  "style": "solid | dashed"
}
```

### Scrollytelling rendering (preferred)

When `layout: "scrollytelling"` is set on the story, all stages share a single sticky diagram panel on the right side of a 60/40 split layout. The diagram smoothly morphs between stages using CSS transitions.

**Components involved:**
- `CrossStageScrollytelling` — The layout wrapper (left: narrative, right: sticky panel)
- `ScrollyDiagram` — Lightweight SVG diagram with CSS transitions
- `GrowthChart` — Exponential growth chart derived from stage `userScale` fields
- `FlipCounter` — Split-flap style counter for stage number and user count

#### How scrollytelling transitions work

The `ScrollyDiagram` component:
1. **Merges all nodes** across all stage diagrams into a unified set
2. **Normalizes positions** into a fixed 440-wide SVG coordinate space (regardless of input positions)
3. Renders ALL nodes and edges, toggling `opacity` for visibility
4. When the active stage changes, nodes slide to new positions via CSS `transform` transitions (0.5s linear) and edges morph via CSS `d` transitions
5. New nodes appearing in a stage fade in at their target position

This means: **node IDs must be consistent across stages.** A node with `id: "server"` in stage 1 must use the same `id: "server"` in stage 2 for the transition to work. If you use different IDs, the diagram will fade out one node and fade in another instead of smoothly moving.

#### Node rendering (icon-based, no boxes)

Nodes render as **standalone icons with labels below** — no background boxes or borders. This creates an open, airy diagram that feels like a schematic illustration.

- **Icon:** 30px stroke icon (centered in node width), using the node type's category color
- **Label:** 10px DM Mono, uppercase, 0.15em letter-spacing, `fill-text-dim`, centered below icon
- **Gap:** 12px from icon bottom to label baseline
- **Node height:** 46px total (icon + gap + label)
- **Node widths:** 50px (default), 55px (server, database)
- **Hover:** Icon opacity dims to 70%, tooltip appears with explanation

These sizes are in SVG coordinate units within the 440-wide normalized space. The normalization step ensures these proportions hold regardless of input position coordinates.

#### Edge rendering (clean lines, minimal labels)

- **Solid edges:** Primary data flows. Stroke width 1.2px, arrow marker 7x5.
- **Dashed edges:** Secondary/read flows, background persistence. `strokeDasharray: "5 4"`.
- **No labels by default.** Keep edges clean. Only add a label for key concepts that need visual reinforcement (e.g., "WebSocket" in stage 3 of chat-app).
- **Single edge per connection.** For bidirectional flows (server <-> database), use ONE edge instead of two parallel lines. The arrow direction shows the primary flow.
- **Arrow markers:** Small polygon at target end, using `--color-border`.

#### Growth chart

The sticky panel includes a growth chart above the diagram that visualizes user growth across stages. It derives data from `stage.userScale` fields ("2 users", "100 users", "1,000 users").

- Y-axis: fixed at max users across all stages
- Curve: exponential (hockey stick) — flat near baseline, shoots up
- All chart paths use `M C C` cubic bezier structure for smooth CSS `d` transitions between stages
- Area fill with gradient under the curve

The chart is built by `GrowthChart.tsx` and requires exactly 3 stages for the hand-tuned exponential paths. A fallback exists for other stage counts.

#### Sticky panel layout

```
+----------------------------+
| Stage [1] : [2] Users      |  ← FlipCounter for stage num + user count
+----------------------------+
| [growth chart]              |  ← GrowthChart
+----------------------------+
| System Architecture         |  ← Section label
+----------------------------+
| [diagram SVG]               |  ← ScrollyDiagram
+----------------------------+
```

### Category colors

Each node type maps to a category color applied to the icon stroke:

| Node type | Category | Color | Hex |
|-----------|----------|-------|-----|
| `client` | Frontend | Muted steel blue | `#3A6B8E` |
| `server` | Server | Slate gray | `#4E5E6E` |
| `api-gateway` | API Layer | Slate gray | `#4E5E6E` |
| `database` | Database | Forest green | `#1D7A42` |
| `cache` | Cache | Warm gold | `#C49A1D` |
| `auth` | Auth | Deep red | `#8C3B3B` |
| `external-service` | External | Accent blue | `#4A7FD4` |
| `queue`, `background-job` | Background Jobs | Muted purple | `#6B5B8A` |
| `load-balancer`, `cdn` | Infrastructure | Steel blue | `#3A6B8E` |
| `storage` | Storage | Sage green | `#5A7A5A` |
| `agent` | Agent | Slate gray | `#4E5E6E` |

### Icons

Each node type has a **stroke-based icon** (Lucide style) rendered as inline SVG. Icons use `currentColor` and `strokeWidth={1.5}` with `strokeLinecap="round"` and `strokeLinejoin="round"`:

- `client` — Monitor with stand
- `server` — Stacked racks with indicator dots and lines
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

### Design principles

#### 1. Progressive complexity

Build Story diagrams evolve across stages. Design each diagram as an evolution of the previous one:

- **Stage 1:** Minimal (2-3 nodes). Introduce the basic request-response flow.
- **Stage 2-3:** Add components as scaling problems emerge. Mark new nodes with `isNew: true`.
- **Later stages:** Full architecture with 6-10+ nodes. Use all relevant node types.

Each new node should feel like a **natural answer** to the problem described in the story narrative.

#### 2. Node ID consistency across stages

**Critical for scrollytelling transitions.** When a component persists across stages, keep the same `id`:
- Stage 1: `{ "id": "server", "label": "Server", "position": { "x": 350, "y": 120 } }`
- Stage 2: `{ "id": "server", "label": "Server", "position": { "x": 350, "y": 60 } }`

The position can change (the node slides to its new position). The label can change. But the ID must stay the same.

#### 3. Spatial layout

Position nodes to communicate architecture layers and data flow direction:

- **Left-to-right flow:** Clients on the left, server in the middle, additional clients or data stores on the right
- **Top-to-bottom for storage:** Database below server
- **Consistent spacing:** ~200-250px between horizontal neighbors, ~150-200px between vertical layers
- **Keep it compact.** Positions are normalized to a 440-wide space, so avoid spreading nodes too far apart. A range of 100-600 on the x-axis and 30-330 on the y-axis works well.

**Layout grid guidance (for a 3-stage chat-app style story):**
```
x: 100    x: 350    x: 560
y: 60   [client]  [server]  [client]     ← Stage 1-2 horizontal row
y: 40                        [client B]  ← Stage 3 splits clients vertically
y: 210                       [client C]
y: 280            [database]             ← Below server, centered
```

#### 4. Node labels

- **Keep it uniform.** "Client", "Server", "Database" — not "Your Browser" or "User A". The node type icon already communicates what it is.
- **2-3 words max.** Labels render at 10px in the SVG space.
- **Technology labels** (like `"technology": "WebSocket"`) can be added to nodes for additional context shown in tooltips.

#### 5. Edge labels

- **Use sparingly.** Most edges need no label — the arrow direction and node types make the flow clear.
- **Only label edges that introduce new concepts.** For example, add "WebSocket" as a label on the client-to-server edge in the stage where WebSockets are introduced. Don't label it in earlier stages.
- **One edge per connection.** Don't create bidirectional edges (A->B and B->A). Use a single edge showing the primary flow direction.

#### 6. Explanations

Node explanations appear in hover tooltips. Write them for a non-technical audience:

- **Start with what it does**, not what it is: "Receives all incoming messages and forwards them to the right person" not "A WebSocket server application"
- **Relate to the story context:** "Permanently stores all messages on disk — survives server restarts"
- **One to two sentences.** Tooltips are small.
- **Update explanations per stage** to reflect the current architecture state

### Workflow

When asked to design or update a diagram:

1. **Read the story context.** Understand the stage narrative — what problem is being introduced? What component solves it?
2. **Read the existing diagrams.** If this is stage N, read stages 1 through N-1 to understand the progression.
3. **Read the component taxonomy** at `.claude/skills/diagram-design/component-taxonomy.json` for category definitions, descriptions, and analogies.
4. **Design the diagram JSON.** Follow the principles above. Ensure node IDs are consistent across stages.
5. **Write the JSON** to `/content/diagrams/{story-slug}.json`, merging with existing diagrams in that file.
6. **Verify the story references.** Ensure any DiagramBlock in the story's stage has a matching `diagramId` in the diagrams file.
7. **Set the story layout.** For progressive architecture stories, set `"layout": "scrollytelling"` in the story JSON.

### Data quality checklist

Before writing diagram JSON, verify:

- [ ] Every `edge.source` and `edge.target` matches a `node.id` in the same diagram
- [ ] Every edge has a unique `id` (convention: `e-{source}-{target}`)
- [ ] Node IDs are consistent across stages (same component = same ID)
- [ ] Node positions don't overlap (minimum ~100px between centers in the 100-600 x-range)
- [ ] New components added in this stage have `isNew: true`
- [ ] Explanations are plain English, 1-2 sentences, starting with what the component does
- [ ] Edge labels are used sparingly — only for key concepts being introduced
- [ ] One edge per connection (no bidirectional pairs)
- [ ] The diagram tells a coherent visual story that matches the stage narrative
