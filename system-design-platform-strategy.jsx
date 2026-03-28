import { useState } from "react";

const COLORS = {
  bg: "#0F0F0F",
  surface: "#1A1A1A",
  surfaceHover: "#222222",
  accent: "#E8FF47",
  accentDim: "#E8FF4720",
  accentMid: "#E8FF4740",
  text: "#F0F0F0",
  textMuted: "#999999",
  textDim: "#666666",
  border: "#2A2A2A",
  blue: "#47B8FF",
  blueDim: "#47B8FF20",
  pink: "#FF6B9D",
  pinkDim: "#FF6B9D20",
  green: "#47FFB8",
  greenDim: "#47FFB820",
  orange: "#FFB847",
  orangeDim: "#FFB84720",
  purple: "#B847FF",
  purpleDim: "#B847FF20",
};

const competitors = [
  {
    name: "ByteByteGo",
    audience: "Mid-Senior SWEs",
    format: "Visual diagrams, video, books",
    strength: "Best visual brand in system design",
    weakness: "Still engineer-only, passive learning",
    price: "$79-499 lifetime",
    color: COLORS.blue,
    x: 75,
    y: 25,
  },
  {
    name: "Educative (Grokking)",
    audience: "SWEs prepping for interviews",
    format: "Interactive text, code sandboxes",
    strength: "Hands-on, browser-based practice",
    weakness: "Dense, intimidating for beginners",
    price: "$47-79/mo subscription",
    color: COLORS.pink,
    x: 65,
    y: 45,
  },
  {
    name: "System Design School",
    audience: "SWEs, all levels",
    format: "Codelabs, Docker, AI feedback",
    strength: "Real code + AI feedback loop",
    weakness: "Requires Docker/coding knowledge",
    price: "$99 lifetime",
    color: COLORS.orange,
    x: 80,
    y: 55,
  },
  {
    name: "Codemia",
    audience: "Interview preppers",
    format: "Whiteboard, mock interviews, AI",
    strength: "Closest to real interview sim",
    weakness: "Pure interview tool, no learning depth",
    price: "$15-30/mo",
    color: COLORS.purple,
    x: 55,
    y: 60,
  },
  {
    name: "Exponent",
    audience: "SWEs + PMs",
    format: "Video, mock interviews, peer practice",
    strength: "Communication + design thinking",
    weakness: "Broad interview prep, not deep on sys design",
    price: "$99-149/mo",
    color: COLORS.green,
    x: 40,
    y: 40,
  },
  {
    name: "YOUR PRODUCT",
    audience: "Vibecoders, PMs, founders, career-switchers",
    format: "Interactive stories, AI tutor, creator platform",
    strength: "Only product for non-engineers who build",
    weakness: "Needs to be built!",
    price: "Freemium → $15-25/mo",
    color: COLORS.accent,
    x: 15,
    y: 20,
  },
];

const userSegments = [
  {
    emoji: "🛠",
    name: "The Vibecoder",
    description: "Built an app with Cursor/Replit, ships fast, but hits walls at scale. Wants to understand 'why it broke' without going back to school.",
    painPoints: [
      "App crashes when shared widely",
      "No mental model for databases vs. caching vs. queues",
      "Existing resources feel like they're for 'real engineers'",
    ],
    jobToBeDone: "Go from 'it works on my laptop' to 'I understand what happens at scale'",
    willPay: "High — already spending on AI coding tools",
  },
  {
    emoji: "📊",
    name: "The PM Who Ships",
    description: "Technical PM or product-minded operator who works with engineers daily. Needs architectural fluency to earn credibility and make better decisions.",
    painPoints: [
      "Can't meaningfully challenge engineering estimates",
      "Reads system design content but it's too low-level",
      "Wants the 'why' not the 'how to implement'",
    ],
    jobToBeDone: "Speak the language of systems well enough to lead technical product decisions",
    willPay: "Medium-High — may expense through employer",
  },
  {
    emoji: "🚀",
    name: "The Technical Founder",
    description: "Non-technical or semi-technical founder using AI tools to build their MVP. Needs to understand enough to hire wisely and avoid costly architecture mistakes.",
    painPoints: [
      "Doesn't know what they don't know about infrastructure",
      "Can't evaluate engineering candidates or proposals",
      "Afraid of building something that can't scale",
    ],
    jobToBeDone: "Make informed technical decisions without becoming an engineer",
    willPay: "High — views this as direct business value",
  },
  {
    emoji: "🔄",
    name: "The Career Switcher",
    description: "Bootcamp grad, self-taught dev, or adjacent tech worker (QA, data, design) who wants to move toward engineering or architecture roles.",
    painPoints: [
      "Interview prep resources assume years of experience",
      "Doesn't have the intuition that comes from building at scale",
      "Needs a gentler on-ramp before Grokking/ByteByteGo",
    ],
    jobToBeDone: "Build enough foundational understanding to tackle traditional system design prep",
    willPay: "Medium — price sensitive but motivated",
  },
];

const features = [
  {
    phase: "Phase 1: Learning Product (MVP)",
    color: COLORS.accent,
    items: [
      {
        name: "Build Stories",
        priority: "P0",
        description: "Narrative-driven lessons: 'You're building a chat app. First it's just you and a friend...' Each stage introduces a concept as the system scales.",
        rationale: "Core differentiator. This is the product. Everything else supports this.",
        effort: "High",
      },
      {
        name: "Explorable Architecture Diagrams",
        priority: "P0",
        description: "Interactive, animated system diagrams where you can click any component to get a plain-English explanation. Think 'Google Maps for system architecture.'",
        rationale: "Visual learning is proven (ByteByteGo's entire moat). Interactive takes it further.",
        effort: "High",
      },
      {
        name: "AI Tutor (Ask Anything)",
        priority: "P0",
        description: "Contextual AI assistant that knows where you are in a lesson and answers questions in beginner-friendly language. No stupid questions mode.",
        rationale: "Removes shame barrier. Turns passive reading into active dialogue.",
        effort: "Medium",
      },
      {
        name: "Concept Glossary with Analogies",
        priority: "P1",
        description: "Every technical term has a real-world analogy. 'A load balancer is like a host at a restaurant — they make sure no single table gets overwhelmed.'",
        rationale: "Reduces intimidation. Makes content shareable and sticky.",
        effort: "Low",
      },
      {
        name: "Progress Map & Streaks",
        priority: "P1",
        description: "Visual skill tree showing what you've learned and what connects to what. Lightweight streaks for habit formation — borrowing from Duolingo without the guilt.",
        rationale: "Retention driver. Makes abstract progress feel tangible.",
        effort: "Medium",
      },
      {
        name: "Mini Design Challenges",
        priority: "P1",
        description: "'You have 10,000 users hitting your API. What breaks first?' Quick scenario-based quizzes after each Build Story section.",
        rationale: "Active recall > passive reading. Also generates engagement data.",
        effort: "Medium",
      },
      {
        name: "Community Show & Tell",
        priority: "P2",
        description: "Users share their own architecture diagrams of things they've built (or are building). Peer feedback + AI review.",
        rationale: "UGC flywheel start. Also validates whether users can apply what they learned.",
        effort: "Medium",
      },
    ],
  },
  {
    phase: "Phase 2: Creator Platform",
    color: COLORS.blue,
    items: [
      {
        name: "AI-Assisted Lesson Builder",
        priority: "P0",
        description: "Experts describe a system verbally or in rough notes → AI generates interactive Build Story draft with diagrams. Creator reviews and edits.",
        rationale: "Removes the #1 barrier to expert content creation: the production work.",
        effort: "Very High",
      },
      {
        name: "Diagram Canvas (Creator Tool)",
        priority: "P0",
        description: "Drag-and-drop architecture diagram editor that auto-generates the interactive, explorable version learners see.",
        rationale: "Core authoring tool. Must be easy enough that a staff engineer can use it in 10 minutes.",
        effort: "Very High",
      },
      {
        name: "Creator Profiles & Revenue Share",
        priority: "P1",
        description: "Experts get a public profile, follower count, and earn revenue share on their content. Think Substack meets Educative.",
        rationale: "Incentive structure for quality content creation.",
        effort: "Medium",
      },
      {
        name: "Peer Review & Quality Score",
        priority: "P1",
        description: "Community + AI-powered review system to ensure creator content meets quality bar before publishing.",
        rationale: "Marketplace quality control. Prevents race to the bottom.",
        effort: "Medium",
      },
      {
        name: "Enterprise & Team Plans",
        priority: "P2",
        description: "Companies buy seats for their non-technical staff, PMs, or junior engineers. Admin dashboard with progress tracking.",
        rationale: "B2B revenue stream. Also provides validation data for the learning outcomes.",
        effort: "High",
      },
    ],
  },
];

const monetization = [
  {
    model: "Freemium",
    description: "First 3 Build Stories free, then $15-25/mo for full library + AI tutor",
    pros: "Low barrier to entry, viral sharing of free content",
    cons: "Need to nail free → paid conversion",
    confidence: "High",
    icon: "🎯",
  },
  {
    model: "Creator Revenue Share",
    description: "70/30 split (creator/platform) on premium content from expert creators",
    pros: "Scales content without internal production cost, attracts experts",
    cons: "Need critical mass of learners first, quality control overhead",
    confidence: "Medium",
    icon: "🤝",
  },
  {
    model: "Enterprise / Team Plans",
    description: "$30-50/seat/mo for companies onboarding PMs, designers, or junior devs",
    pros: "Higher ARPU, longer contracts, validates learning outcomes",
    cons: "Requires sales motion, longer sales cycle",
    confidence: "Medium-High",
    icon: "🏢",
  },
  {
    model: "Sponsorships & Partnerships",
    description: "Cloud providers (AWS, GCP) or dev tools sponsor content that teaches using their products",
    pros: "Non-dilutive revenue, aligns with learning context",
    cons: "Requires scale/audience first, risk of feeling like ads",
    confidence: "Low (later stage)",
    icon: "💎",
  },
];

function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 20px",
        background: active ? COLORS.accent : "transparent",
        color: active ? COLORS.bg : COLORS.textMuted,
        border: `1px solid ${active ? COLORS.accent : COLORS.border}`,
        borderRadius: "100px",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: active ? "700" : "500",
        fontFamily: "'DM Sans', sans-serif",
        transition: "all 0.2s ease",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}

function CompetitiveMap() {
  const [hovered, setHovered] = useState(null);

  return (
    <div>
      <p style={{ color: COLORS.textMuted, fontSize: "13px", marginBottom: "24px", fontFamily: "'DM Sans', sans-serif" }}>
        Plotted by audience accessibility (x: technical → accessible) and interactivity (y: passive → interactive). Your product occupies a whitespace nobody else is in.
      </p>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "420px",
          background: COLORS.surface,
          borderRadius: "16px",
          border: `1px solid ${COLORS.border}`,
          overflow: "hidden",
        }}
      >
        {/* Axis labels */}
        <div style={{ position: "absolute", bottom: "8px", left: "50%", transform: "translateX(-50%)", color: COLORS.textDim, fontSize: "11px", fontFamily: "'DM Sans', sans-serif" }}>
          More Technical →
        </div>
        <div style={{ position: "absolute", bottom: "8px", left: "12px", color: COLORS.textDim, fontSize: "11px", fontFamily: "'DM Sans', sans-serif" }}>
          ← More Accessible
        </div>
        <div style={{ position: "absolute", top: "8px", left: "12px", color: COLORS.textDim, fontSize: "11px", fontFamily: "'DM Sans', sans-serif", writingMode: "vertical-lr", transform: "rotate(180deg)" }}>
          ← More Interactive
        </div>
        <div style={{ position: "absolute", bottom: "28px", left: "12px", color: COLORS.textDim, fontSize: "11px", fontFamily: "'DM Sans', sans-serif", writingMode: "vertical-lr", transform: "rotate(180deg)" }}>
          More Passive →
        </div>

        {/* Grid lines */}
        {[25, 50, 75].map((pos) => (
          <div key={`v-${pos}`} style={{ position: "absolute", left: `${pos}%`, top: 0, bottom: 0, width: "1px", background: COLORS.border, opacity: 0.5 }} />
        ))}
        {[25, 50, 75].map((pos) => (
          <div key={`h-${pos}`} style={{ position: "absolute", top: `${pos}%`, left: 0, right: 0, height: "1px", background: COLORS.border, opacity: 0.5 }} />
        ))}

        {/* Whitespace highlight */}
        <div
          style={{
            position: "absolute",
            left: "2%",
            top: "2%",
            width: "35%",
            height: "45%",
            background: COLORS.accentDim,
            border: `1px dashed ${COLORS.accent}40`,
            borderRadius: "12px",
          }}
        />
        <div style={{
          position: "absolute", left: "5%", top: "5%", color: COLORS.accent, fontSize: "10px",
          fontFamily: "'DM Sans', sans-serif", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", opacity: 0.7,
        }}>
          Whitespace
        </div>

        {/* Competitor dots */}
        {competitors.map((c, i) => {
          const isYours = c.name === "YOUR PRODUCT";
          const isHovered = hovered === i;
          return (
            <div
              key={c.name}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                position: "absolute",
                left: `${c.x}%`,
                top: `${c.y}%`,
                transform: "translate(-50%, -50%)",
                zIndex: isHovered ? 10 : isYours ? 5 : 1,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: isYours ? "18px" : "12px",
                  height: isYours ? "18px" : "12px",
                  borderRadius: "50%",
                  background: c.color,
                  boxShadow: `0 0 ${isYours ? "20px" : "10px"} ${c.color}60`,
                  transition: "all 0.2s ease",
                  transform: isHovered ? "scale(1.5)" : "scale(1)",
                }}
              />
              <div style={{
                position: "absolute",
                top: isYours ? "24px" : "18px",
                left: "50%",
                transform: "translateX(-50%)",
                whiteSpace: "nowrap",
                fontSize: isYours ? "12px" : "11px",
                fontWeight: isYours ? "700" : "500",
                color: c.color,
                fontFamily: "'DM Sans', sans-serif",
              }}>
                {c.name}
              </div>

              {/* Hover tooltip */}
              {isHovered && (
                <div style={{
                  position: "absolute",
                  top: isYours ? "44px" : "36px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: COLORS.bg,
                  border: `1px solid ${c.color}40`,
                  borderRadius: "10px",
                  padding: "12px 16px",
                  width: "240px",
                  zIndex: 20,
                }}>
                  <div style={{ fontSize: "11px", color: COLORS.textMuted, marginBottom: "4px", fontFamily: "'DM Sans', sans-serif" }}>{c.audience}</div>
                  <div style={{ fontSize: "11px", color: COLORS.text, marginBottom: "6px", fontFamily: "'DM Sans', sans-serif" }}>{c.format}</div>
                  <div style={{ fontSize: "11px", color: COLORS.green, fontFamily: "'DM Sans', sans-serif" }}>✦ {c.strength}</div>
                  <div style={{ fontSize: "11px", color: COLORS.pink, marginTop: "2px", fontFamily: "'DM Sans', sans-serif" }}>✧ {c.weakness}</div>
                  <div style={{ fontSize: "11px", color: COLORS.textDim, marginTop: "4px", fontFamily: "'DM Sans', sans-serif" }}>{c.price}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function UserSegments() {
  const [expanded, setExpanded] = useState(0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {userSegments.map((seg, i) => (
        <div
          key={seg.name}
          onClick={() => setExpanded(expanded === i ? -1 : i)}
          style={{
            background: expanded === i ? COLORS.surface : "transparent",
            border: `1px solid ${expanded === i ? COLORS.accent + "40" : COLORS.border}`,
            borderRadius: "12px",
            padding: "16px 20px",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "24px" }}>{seg.emoji}</span>
              <div>
                <div style={{ fontSize: "15px", fontWeight: "600", color: COLORS.text, fontFamily: "'DM Sans', sans-serif" }}>{seg.name}</div>
                <div style={{ fontSize: "12px", color: COLORS.textMuted, fontFamily: "'DM Sans', sans-serif", marginTop: "2px" }}>{seg.description.slice(0, 80)}...</div>
              </div>
            </div>
            <span style={{ color: COLORS.textDim, fontSize: "18px", transform: expanded === i ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
          </div>

          {expanded === i && (
            <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: `1px solid ${COLORS.border}` }}>
              <p style={{ fontSize: "13px", color: COLORS.text, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6, marginBottom: "16px" }}>
                {seg.description}
              </p>
              <div style={{ marginBottom: "12px" }}>
                <div style={{ fontSize: "11px", color: COLORS.pink, fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", fontFamily: "'DM Sans', sans-serif" }}>Pain Points</div>
                {seg.painPoints.map((p, j) => (
                  <div key={j} style={{ fontSize: "13px", color: COLORS.textMuted, fontFamily: "'DM Sans', sans-serif", marginBottom: "4px", paddingLeft: "12px", borderLeft: `2px solid ${COLORS.pink}30` }}>
                    {p}
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: "12px" }}>
                <div style={{ fontSize: "11px", color: COLORS.accent, fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px", fontFamily: "'DM Sans', sans-serif" }}>Job to Be Done</div>
                <div style={{ fontSize: "13px", color: COLORS.text, fontFamily: "'DM Sans', sans-serif", fontStyle: "italic" }}>"{seg.jobToBeDone}"</div>
              </div>
              <div>
                <div style={{ fontSize: "11px", color: COLORS.green, fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px", fontFamily: "'DM Sans', sans-serif" }}>Willingness to Pay</div>
                <div style={{ fontSize: "13px", color: COLORS.textMuted, fontFamily: "'DM Sans', sans-serif" }}>{seg.willPay}</div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function FeatureRoadmap() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {features.map((phase) => (
        <div key={phase.phase}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: phase.color, fontFamily: "'DM Sans', sans-serif", marginBottom: "16px" }}>
            {phase.phase}
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {phase.items.map((item) => (
              <details
                key={item.name}
                style={{
                  background: COLORS.surface,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: "10px",
                  overflow: "hidden",
                }}
              >
                <summary
                  style={{
                    padding: "14px 18px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    fontSize: "14px",
                    color: COLORS.text,
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: "500",
                    listStyle: "none",
                  }}
                >
                  <span style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    background: item.priority === "P0" ? COLORS.accent : item.priority === "P1" ? COLORS.blue : COLORS.textDim,
                    color: item.priority === "P0" ? COLORS.bg : item.priority === "P1" ? COLORS.bg : COLORS.text,
                    fontFamily: "'DM Mono', monospace",
                    flexShrink: 0,
                  }}>
                    {item.priority}
                  </span>
                  <span style={{ flex: 1 }}>{item.name}</span>
                  <span style={{
                    fontSize: "10px",
                    color: COLORS.textDim,
                    fontFamily: "'DM Sans', sans-serif",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}>
                    {item.effort} effort
                  </span>
                </summary>
                <div style={{ padding: "0 18px 16px 18px", borderTop: `1px solid ${COLORS.border}` }}>
                  <p style={{ fontSize: "13px", color: COLORS.text, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6, marginTop: "12px" }}>
                    {item.description}
                  </p>
                  <div style={{ marginTop: "10px", padding: "10px 14px", background: COLORS.accentDim, borderRadius: "8px", borderLeft: `3px solid ${phase.color}` }}>
                    <span style={{ fontSize: "11px", color: phase.color, fontWeight: "600", fontFamily: "'DM Sans', sans-serif" }}>WHY: </span>
                    <span style={{ fontSize: "12px", color: COLORS.textMuted, fontFamily: "'DM Sans', sans-serif" }}>{item.rationale}</span>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Monetization() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
      {monetization.map((m) => (
        <div
          key={m.model}
          style={{
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <div style={{ fontSize: "24px", marginBottom: "8px" }}>{m.icon}</div>
          <div style={{ fontSize: "15px", fontWeight: "700", color: COLORS.text, fontFamily: "'DM Sans', sans-serif", marginBottom: "4px" }}>
            {m.model}
          </div>
          <div style={{ fontSize: "12px", color: COLORS.textMuted, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5, marginBottom: "12px" }}>
            {m.description}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ fontSize: "11px", fontFamily: "'DM Sans', sans-serif" }}>
              <span style={{ color: COLORS.green }}>+</span>{" "}
              <span style={{ color: COLORS.textMuted }}>{m.pros}</span>
            </div>
            <div style={{ fontSize: "11px", fontFamily: "'DM Sans', sans-serif" }}>
              <span style={{ color: COLORS.pink }}>−</span>{" "}
              <span style={{ color: COLORS.textMuted }}>{m.cons}</span>
            </div>
          </div>
          <div style={{
            marginTop: "12px",
            fontSize: "10px",
            color: m.confidence === "High" ? COLORS.green : m.confidence === "Medium-High" ? COLORS.blue : m.confidence === "Medium" ? COLORS.orange : COLORS.textDim,
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: "1px",
            fontFamily: "'DM Sans', sans-serif",
          }}>
            Confidence: {m.confidence}
          </div>
        </div>
      ))}
    </div>
  );
}

function PositioningSummary() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{
        background: `linear-gradient(135deg, ${COLORS.accentDim}, ${COLORS.blueDim})`,
        border: `1px solid ${COLORS.accent}30`,
        borderRadius: "16px",
        padding: "28px",
      }}>
        <div style={{ fontSize: "11px", color: COLORS.accent, fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "12px", fontFamily: "'DM Sans', sans-serif" }}>
          Positioning Statement
        </div>
        <p style={{ fontSize: "18px", color: COLORS.text, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5, fontWeight: "300" }}>
          For <strong style={{ color: COLORS.accent }}>builders who aren't engineers</strong> — vibecoders, PMs, founders — who need to understand system design to <strong style={{ color: COLORS.accent }}>build better, hire smarter, and lead technical products</strong>.
        </p>
        <p style={{ fontSize: "14px", color: COLORS.textMuted, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6, marginTop: "12px" }}>
          Unlike ByteByteGo or Educative, which teach engineers to pass interviews, we teach builders to <em>think in systems</em> through interactive stories, visual exploration, and an AI tutor that meets you where you are.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
        {[
          { label: "Learn by Building", desc: "Follow a scaling story, not a textbook. 'Your app just got 10x users — what breaks?'", icon: "📖" },
          { label: "See the System", desc: "Interactive architecture diagrams you can explore, click into, and ask questions about.", icon: "🔍" },
          { label: "No Shame Zone", desc: "AI tutor that explains like a patient friend, not a gatekeeping senior engineer.", icon: "💬" },
        ].map((v) => (
          <div key={v.label} style={{
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
            borderRadius: "12px",
            padding: "20px",
          }}>
            <div style={{ fontSize: "28px", marginBottom: "10px" }}>{v.icon}</div>
            <div style={{ fontSize: "14px", fontWeight: "700", color: COLORS.text, fontFamily: "'DM Sans', sans-serif", marginBottom: "6px" }}>{v.label}</div>
            <div style={{ fontSize: "12px", color: COLORS.textMuted, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5 }}>{v.desc}</div>
          </div>
        ))}
      </div>

      <div style={{
        background: COLORS.surface,
        border: `1px solid ${COLORS.border}`,
        borderRadius: "12px",
        padding: "20px",
      }}>
        <div style={{ fontSize: "11px", color: COLORS.blue, fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "12px", fontFamily: "'DM Sans', sans-serif" }}>
          The Flywheel
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
          {[
            "Build Stories attract learners",
            "Learners generate demand for more content",
            "Experts create content with AI tools",
            "More content attracts more learners",
            "Revenue funds better tooling",
          ].map((step, i, arr) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{
                background: COLORS.bg,
                border: `1px solid ${COLORS.blue}40`,
                borderRadius: "8px",
                padding: "8px 14px",
                fontSize: "12px",
                color: COLORS.text,
                fontFamily: "'DM Sans', sans-serif",
                whiteSpace: "nowrap",
              }}>
                {step}
              </div>
              {i < arr.length - 1 && <span style={{ color: COLORS.blue, fontSize: "16px" }}>→</span>}
            </div>
          ))}
          <span style={{ color: COLORS.accent, fontSize: "16px" }}>↻</span>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label: "Positioning", component: <PositioningSummary /> },
    { label: "Competitive Map", component: <CompetitiveMap /> },
    { label: "User Segments", component: <UserSegments /> },
    { label: "Feature Priorities", component: <FeatureRoadmap /> },
    { label: "Monetization", component: <Monetization /> },
  ];

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", color: COLORS.text, padding: "40px 32px" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ marginBottom: "8px" }}>
          <span style={{ fontSize: "11px", color: COLORS.accent, fontWeight: "600", textTransform: "uppercase", letterSpacing: "2px", fontFamily: "'DM Mono', monospace" }}>
            Product Strategy
          </span>
        </div>
        <h1 style={{ fontSize: "32px", fontWeight: "700", fontFamily: "'DM Sans', sans-serif", marginBottom: "8px", lineHeight: 1.2 }}>
          System Design for Builders
        </h1>
        <p style={{ fontSize: "15px", color: COLORS.textMuted, fontFamily: "'DM Sans', sans-serif", marginBottom: "32px", maxWidth: "600px" }}>
          A learning platform (and future creator marketplace) that makes system design accessible to vibecoders, PMs, and founders — not just engineers prepping for interviews.
        </p>

        <div style={{ display: "flex", gap: "8px", marginBottom: "32px", flexWrap: "wrap" }}>
          {tabs.map((tab, i) => (
            <Tab key={tab.label} label={tab.label} active={activeTab === i} onClick={() => setActiveTab(i)} />
          ))}
        </div>

        <div style={{ minHeight: "400px" }}>
          {tabs[activeTab].component}
        </div>
      </div>
    </div>
  );
}
