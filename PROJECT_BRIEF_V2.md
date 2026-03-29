# System Design for Builders — Project Brief

## What This Is

Two products under one brand, one website:

1. **The Skill (lead product)** — A Claude Code skill that scans a codebase and generates an interactive HTML architecture map with plain-English annotations, risk overlays, and clickable explanations. Designed for non-engineers (PMs, founders, vibecoders) who need to understand a system without reading the code. Runs locally — no code leaves the user's environment.

2. **The Website (marketing + learning companion)** — A single site that serves as the landing page for the skill (install instructions, demo, example output) AND hosts optional learning content ("Build Stories") for users who want to go deeper on the concepts the skill surfaces. Not a standalone learning platform — a companion to the skill.

## The Problem

Non-engineers who work with codebases (PMs onboarding to teams, founders directing AI agents, vibecoders who shipped something and need to understand what they built) have no way to *see* their system architecture in a way that's visual, interactive, and explained in human language.

Today's options:
- **Ask an engineer** — works, but they're busy and the knowledge dies after the conversation.
- **Read the docs** — usually stale, incomplete, and written for other engineers.
- **Ask Claude Code directly** — gets you 70-80% of the way with good prompting, but produces text that disappears with the session. No persistent, visual, shareable artifact. Output quality varies based on how well you prompt. Defaults to engineer-speak unless you specifically ask otherwise.
- **Existing architecture skills** — several exist (excalidraw-toolkit, architecture-diagrams, code-visualizer, architect-review) but ALL of them produce engineer-facing output (Mermaid, Excalidraw JSON, C4 models) with zero interpretation, zero risk analysis, and zero plain-English explanation. They visualize structure but don't explain what it means or what's wrong.

The gap: **Nobody has built a tool that takes a codebase and produces a living, interactive, visual artifact that a non-engineer can look at, click around in, share in a Slack thread, pull up in a meeting, and actually point to when discussing the system.**

## Target Users

1. **PMs onboarding to a team** — Need to understand the system architecture before (or instead of) scheduling five 1:1s with engineers. Want to walk into sprint planning with an informed picture of the system and its risks.
2. **PMs scoping features** — "We're about to build Feature X — what are the architectural implications? Will our current system support it?" This is the recurring use case that makes the skill sticky.
3. **Vibecoders who shipped something** — Built an app with Claude Code or Cursor, it works, but they don't fully understand what was built or where it might break. Want to see what they have.
4. **Technical founders** — Directing AI agents to build their MVP. Need to understand what they've got before hiring engineers or pitching investors.
5. **Anyone explaining a system to a non-technical stakeholder** — The visual artifact is something you can share, present, and reference.

## Product 1: The Skill

### What it does

User runs `/architecture-review` (or asks "review my architecture") in Claude Code. The skill:

1. **Scans the codebase** via Explore subagent (forked context, read-only). Discovers: routes/endpoints, database models/schemas, API integrations, auth patterns, caching layers, queue/job systems, file storage, environment variables, external service calls.

2. **Classifies components** into a structured architecture map: frontend, API layer, databases, cache, auth, external services, background jobs, storage, etc.

3. **Runs risk analysis** against a reference file of common architectural anti-patterns, each tagged with a scale threshold and severity. Example patterns:
   - "Sessions stored in primary database → bottleneck at ~500 concurrent users"
   - "No caching on read-heavy endpoints → latency issues at ~100 RPS"
   - "Images stored in database as BLOBs → storage cost explosion at ~10K records"
   - "No rate limiting on public API → vulnerability at any scale"

4. **Generates an interactive HTML file** and opens it in the browser. The output should:
   - Show the architecture as a visual, interactive map — components should be browsable, not just listed as text
   - Make risks visually obvious (color-coding, icons, or other visual signals for severity)
   - Let users click/interact with components to see plain-English explanations with real-world analogies
   - Let users click/interact with risks to see what the problem is, when it'll bite, and what the fix looks like
   - Include a summary risk report in plain English
   - Link to relevant Build Stories on the companion website (for users who want to go deeper)
   - Be self-contained (single file, no external dependencies) so it works offline and can be shared as-is
   - Implementation approach for the visualization (SVG, Canvas, D3, plain HTML/CSS, etc.) is open — optimize for clarity and maintainability

5. **Offers to fix** — For each flagged risk, the user can say "fix this" and the skill applies the fix while explaining what it changed and why.

### Key design principles for the skill

- **Plain English always.** "Your user sessions are stored in your main database. Think of it like checking IDs at a bank vault for every page load — it works when there are 5 customers, but at 500 there's a line out the door. Redis is like a fast badge-scanner at the entrance." Never: "Consider migrating session persistence to an in-memory data store to reduce I/O overhead on the primary RDBMS."
- **On-demand, never proactive.** User invokes it when they want it. No Clippy.
- **Visual output is the product.** The HTML artifact is what differentiates this from just asking Claude Code. It's persistent, shareable, and designed for humans who think visually.
- **Scale-aware, not dogmatic.** Don't tell a side-project builder to implement Kafka. Risks should be calibrated to the project's likely scale (inferred from the codebase complexity, deployment config, etc.).
- **Consistent output.** Every run produces the same structured artifact, regardless of who invokes it or how they prompt. This matters for teams.

### Skill architecture

The skill needs these pieces — file structure and implementation approach are flexible:

- **SKILL.md** — Main skill file with triggers and instructions
- **Risk patterns reference** — The core knowledge asset. A structured library of common architectural anti-patterns, each with: the pattern to detect, the scale at which it becomes a problem, the severity, a plain-English explanation with analogy, and the recommended fix. This is what makes the skill more than just "ask Claude Code."
- **Component taxonomy** — How to classify discovered components into human-readable categories
- **Analogy bank** — Plain-English analogies for common system design concepts (used in both the HTML output and the fix explanations)
- **Visualization generator** — Script or template that produces the interactive HTML output

Key constraints:
- Should use `context: fork` or equivalent to scan the codebase without bloating the main conversation
- The HTML output must be self-contained (single file, works offline, can be shared)
- Should work across common frameworks (Next.js, Django, Rails, Express, Flask, etc.) by detecting project type first
- Risk patterns reference should be easy to extend — this is where expert knowledge accumulates over time

### Competitive positioning for the skill

Existing architecture skills (1,200+ in the ecosystem) do **visualization without interpretation**. They'll draw a diagram of what your codebase *is*, but none tell you what's *wrong* or explain it in human language. This skill combines: codebase scan → visual map → risk analysis → plain-English explanation → actionable fixes. For non-engineers, by design.

## Product 2: The Website

### Structure

One domain, three sections:

1. **Landing page** — Hero showing the skill in action (demo video or animated example of the HTML output). Install instructions. Value prop: "Understand any codebase in 5 minutes." Social proof once available. This is the primary page.

2. **Build Stories** (tab/section) — Optional narrative-driven lessons for users who want to understand system design concepts more deeply. Structured as scaling journeys: "You're building a chat app. First it's just you and a friend. Then 1,000 people join." Each stage introduces a concept through a problem the learner can feel. Interactive, explorable architecture diagrams embedded in the stories.

3. **Concept Glossary** (tab/section) — Every technical term the skill might surface, with a plain-English definition and real-world analogy. This is the destination when a user clicks "learn more" in the skill's HTML output.

### Design principles for the website

- **Skill-first.** The landing page leads with the skill. Build Stories and Glossary are clearly secondary — "want to go deeper?" not "welcome to our learning platform."
- **Non-intimidating.** Warm, approachable visual design. Should feel more like a beautifully designed consumer product (Linear, Notion) than an enterprise LMS or a developer docs site.
- **Aesthetically distinctive.** This is the brand's first impression. Must not look like every other developer tool landing page.

### Tech considerations for the website

- Static site or lightweight framework (Next.js, Astro, or similar)
- Build Stories content should be structured data (JSON/MDX), not hardcoded — enables future contributor tooling
- Interactive diagrams in Build Stories: implementation approach is open
- No auth needed initially — all content is free/public
- Deploy to Vercel or similar
- SEO matters — Build Stories and Glossary entries should be indexable (organic traffic from people searching system design concepts)

## What's NOT in scope for MVP

- Monetization (no paywalls, no subscriptions, no premium tier)
- Creator platform / contributor tooling (future, if the content format proves out)
- AI tutor on the website (the skill's Claude Code context handles this)
- User accounts / progress tracking on the website
- Enterprise features

## Success metrics (qualitative for now)

- Skill: Do non-engineers find the HTML output genuinely useful? Can they explain their system's architecture after using it?
- Skill: Is the output good enough to share in a Slack channel or meeting?
- Website: Do people click through from the skill's output to Build Stories?
- Website: Do Build Stories actually help people understand the concepts the skill surfaces?

## Build order

1. **Skill MVP** — SKILL.md + risk patterns reference + HTML visualization script. Test on 3-5 real codebases of varying complexity.
2. **Website landing page** — Marketing site for the skill. Install instructions, demo, example output.
3. **Concept Glossary** — Plain-English definitions for every term the skill might surface. Link from the skill's HTML output.
4. **First 2-3 Build Stories** — Start with the most common concepts the skill flags (databases, caching, auth patterns).
5. **Iterate based on feedback** — Which risks does the skill flag most often? What questions do users ask? Build content around that.
