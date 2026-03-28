# System Design for Builders — Project Brief

## What This Is
A web application that teaches system design to non-traditional technical audiences (vibecoders, PMs, technical founders, career switchers) through interactive, narrative-driven lessons. Not an interview prep tool — a learning product for people who build with AI tools and want to understand what's happening under the hood.

## The Problem
Every existing system design learning platform (ByteByteGo, Educative/Grokking, System Design School, Codemia, Exponent) targets software engineers preparing for FAANG interviews. They assume deep technical background and use engineer-to-engineer language. Meanwhile, a growing population of builders — people shipping apps with Cursor, Replit, and AI tools — have no accessible way to learn *why* systems work the way they do. They hit scaling walls and have no mental model for databases, caching, load balancing, or distributed systems.

## Target Users
1. **Vibecoders** — Built apps with AI tools, ship fast, but hit walls at scale. Want to understand "why it broke" without going back to school.
2. **PMs** — Work with engineers daily, need architectural fluency to lead technical decisions and earn credibility.
3. **Technical Founders** — Using AI to build MVPs, need to understand enough to hire wisely and avoid costly architecture mistakes.
4. **Career Switchers** — Bootcamp grads, self-taught devs, or adjacent tech workers who need a gentler on-ramp before traditional system design prep.

## Core Product Concept: Build Stories
The centerpiece is **Build Stories** — narrative-driven, interactive lessons structured as scaling journeys:
- "You're building a chat app. First it's just you and a friend. Then 1,000 people join. Then 1 million."
- Each stage introduces a system design concept (databases, caching, queuing, load balancing, etc.) as a *response to a problem the learner can feel*, not as abstract theory.
- Concepts are paired with **interactive, explorable architecture diagrams** where learners can click on any component to get a plain-English explanation.
- An **AI tutor** is contextually available throughout, answering questions in beginner-friendly language with no judgment.

## Key Design Principles
- **Non-intimidating**: Warm, approachable visual design. No dense walls of text or code-first explanations. Real-world analogies everywhere.
- **Narrative over curriculum**: Learning is structured as stories, not chapters. Each Build Story has a beginning (simple app), rising tension (things break at scale), and resolution (you learn the concept that fixes it).
- **Interactive over passive**: Explorable diagrams, inline quizzes ("10,000 users just hit your API — what breaks first?"), and AI dialogue — not just reading.
- **Progressive disclosure**: Start simple, reveal complexity only when the learner is ready. Never front-load jargon.
- **Aesthetically distinctive**: Should feel more like a beautifully designed consumer product (Duolingo, Linear, Notion) than an enterprise LMS.

## MVP Feature Set (Phase 1)
1. **Build Stories Engine** — Render narrative lessons with stages, each introducing a system design concept through a scaling scenario. Support text, diagrams, and interactive checkpoints.
2. **Explorable Architecture Diagrams** — Interactive system diagrams (SVG/Canvas) where components are clickable and show explanations. Should animate to show data flow, request paths, failure points.
3. **AI Tutor** — Contextual chat interface that knows which Build Story and stage the learner is in. Answers questions in beginner-friendly language. Powered by Claude API.
4. **Concept Glossary** — Every technical term links to a plain-English definition with a real-world analogy (e.g., "A load balancer is like a restaurant host — they make sure no single table gets overwhelmed").
5. **Progress Tracking** — Visual skill map showing completed stories, concepts learned, and what connects to what. Lightweight streaks for habit formation.
6. **Mini Design Challenges** — Short scenario-based questions after each Build Story section for active recall ("Your database is getting slow with 50K users. Which of these approaches would help? Why?").

## Future Vision (Phase 2 — Creator Platform)
The long-term play is opening this up as a **creator marketplace** where domain experts can publish their own Build Stories using AI-assisted authoring tools:
- AI Lesson Builder: Expert describes a system verbally or in rough notes → AI generates a Build Story draft with diagrams → expert reviews and edits.
- Diagram Canvas: Drag-and-drop architecture diagram editor that auto-generates the interactive version learners see.
- Creator profiles, revenue share (70/30 creator/platform), quality review system.
- Enterprise/team plans for companies onboarding non-technical staff.

Phase 2 is NOT in scope for the MVP. Mentioning it here for architectural awareness — the content model and rendering engine should be designed with extensibility in mind (content as structured data, not hardcoded).

## Tech Considerations
- Web app (React or Next.js)
- Content model should be structured/declarative (JSON or similar) so Build Stories are data, not code — this enables the future creator tools
- Interactive diagrams likely SVG-based with animation support
- AI tutor via Claude API (contextual, per-lesson)
- Auth + progress persistence (Supabase, Firebase, or similar)
- Deploy to Vercel or similar

## Monetization Model (for context, not for MVP build)
- Freemium: First 2-3 Build Stories free, then $15-25/mo subscription
- Future: Creator revenue share, enterprise team plans, cloud provider sponsorships

## Competitive Positioning
The only system design learning product built for people who build with AI tools but aren't traditional engineers. Every competitor targets SWEs preparing for interviews. We target builders who want to understand systems to ship better products.
