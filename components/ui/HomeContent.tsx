"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Story, CurriculumModule } from "@/types/story";

const MODULE_COLORS: Record<string, string> = {
  accent: "border-accent/20 hover:border-accent/40",
  blue: "border-blue/20 hover:border-blue/40",
  green: "border-green/20 hover:border-green/40",
  orange: "border-orange/20 hover:border-orange/40",
  pink: "border-pink/20 hover:border-pink/40",
  purple: "border-purple/20 hover:border-purple/40",
};

const MODULE_TEXT_COLORS: Record<string, string> = {
  accent: "text-accent",
  blue: "text-blue",
  green: "text-green",
  orange: "text-orange",
  pink: "text-pink",
  purple: "text-purple",
};

const MODULE_BG_COLORS: Record<string, string> = {
  accent: "bg-accent-dim",
  blue: "bg-blue-dim",
  green: "bg-green-dim",
  orange: "bg-orange-dim",
  pink: "bg-pink-dim",
  purple: "bg-purple-dim",
};

type Tab = "stories" | "curriculum";

const TABS = [
  { id: "stories" as Tab, label: "Build Stories", path: "/" },
  { id: "curriculum" as Tab, label: "Curriculum", path: "/curriculum" },
] as const;

interface Props {
  stories: Story[];
  modules: CurriculumModule[];
  initialTab: Tab;
}

export function HomeContent({ stories, modules, initialTab }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  function switchTab(tab: Tab) {
    setActiveTab(tab);
    const path = tab === "stories" ? "/" : "/curriculum";
    window.history.replaceState(null, "", path);
  }

  // Sync with browser back/forward
  useEffect(() => {
    function onPopState() {
      setActiveTab(window.location.pathname === "/curriculum" ? "curriculum" : "stories");
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return (
    <>
      {/* Sticky Tabs */}
      <div className="sticky top-0 z-40 bg-bg/90 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-6">
          <nav className="flex gap-8">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => switchTab(tab.id)}
                className={`relative py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "text-text"
                    : "text-text-dim hover:text-text-muted"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent" />
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab content */}
      <main className="max-w-4xl mx-auto px-6 pb-24 pt-12">
        {activeTab === "stories" ? (
          <StoriesPanel stories={stories} />
        ) : (
          <CurriculumPanel modules={modules} />
        )}
      </main>
    </>
  );
}

function StoriesPanel({ stories }: { stories: Story[] }) {
  return (
    <>
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-dim">
          Build Stories
        </h2>
        <span className="text-xs text-text-dim">
          {stories.length} {stories.length === 1 ? "story" : "stories"}
        </span>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {stories.map((story, i) => (
          <Link
            key={story.id}
            href={`/stories/${story.slug}`}
            className="group bg-surface border border-border rounded-2xl p-8 hover:border-accent/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out animate-[fade-up_0.4s_ease-out_both]"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-center gap-2 mb-5">
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-green-dim text-green border border-green/20">
                {story.difficulty}
              </span>
              <span className="text-[11px] text-text-dim font-mono">
                ~{story.estimatedMinutes} min
              </span>
            </div>
            <h3 className="text-2xl font-bold text-text group-hover:text-accent transition-colors mb-2 leading-snug">
              {story.title}
            </h3>
            <p className="text-sm text-text-muted mb-1">
              {story.subtitle}
            </p>
            <p className="text-xs text-text-dim leading-relaxed mt-4 line-clamp-2">
              {story.description}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-6 pt-5 border-t border-border/60">
              {story.concepts.slice(0, 4).map((c) => (
                <span
                  key={c}
                  className="text-[10px] px-2 py-0.5 rounded bg-bg border border-border text-text-dim font-mono"
                >
                  {c}
                </span>
              ))}
              {story.concepts.length > 4 && (
                <span className="text-[10px] text-text-dim">
                  +{story.concepts.length - 4} more
                </span>
              )}
            </div>
          </Link>
        ))}
        {/* Coming soon placeholder */}
        <div className="border border-dashed border-text-dim/20 rounded-2xl p-8 flex items-center justify-center">
          <p className="text-text-dim text-sm text-center italic">
            More stories coming soon
          </p>
        </div>
      </div>
    </>
  );
}

function CurriculumPanel({ modules }: { modules: CurriculumModule[] }) {
  return (
    <>
      <div className="space-y-5">
        {modules.map((mod, i) => (
          <Link
            key={mod.id}
            href={`/curriculum/${mod.slug}`}
            className={`group block bg-surface border ${MODULE_COLORS[mod.color]} rounded-2xl p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out animate-[fade-up_0.4s_ease-out_both]`}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex items-start gap-5">
              <div
                className={`flex-shrink-0 w-16 h-16 rounded-2xl ${MODULE_BG_COLORS[mod.color]} flex items-center justify-center text-2xl font-bold font-mono ${MODULE_TEXT_COLORS[mod.color]}`}
              >
                {mod.moduleNumber}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className={`text-[11px] font-mono font-medium ${MODULE_TEXT_COLORS[mod.color]}`}
                  >
                    Module {mod.moduleNumber}
                  </span>
                  <span className="text-[11px] text-text-dim">
                    {mod.lessons.length} lessons
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-text group-hover:text-accent transition-colors leading-snug">
                  {mod.title}
                </h2>
                <p className="text-sm text-text-muted mt-1.5">
                  {mod.subtitle}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-border/50">
                  {mod.lessons.slice(0, 3).map((lesson) => (
                    <span
                      key={lesson.id}
                      className="text-[10px] px-2 py-0.5 rounded bg-bg border border-border text-text-dim"
                    >
                      {lesson.title.length > 30
                        ? lesson.title.slice(0, 30) + "..."
                        : lesson.title}
                    </span>
                  ))}
                  {mod.lessons.length > 3 && (
                    <span className="text-[10px] text-text-dim">
                      +{mod.lessons.length - 3} more
                    </span>
                  )}
                </div>
              </div>
              <span className="text-text-dim group-hover:text-accent group-hover:translate-x-1 transition-all text-lg mt-3">
                &rarr;
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Future modules placeholder */}
      <div className="mt-5 space-y-4">
        {[
          { num: 3, title: "Architecture Patterns" },
          { num: 4, title: "Making It Real (Deployment)" },
          { num: 5, title: "Level Up" },
          { num: 6, title: "AI-Specific Concepts" },
        ].map((mod) => (
          <div
            key={mod.num}
            className="bg-surface/50 border border-dashed border-border rounded-2xl p-8 flex items-center gap-5 opacity-35"
          >
            <div className="w-16 h-16 rounded-2xl bg-bg flex items-center justify-center text-2xl font-mono text-text-dim">
              {mod.num}
            </div>
            <div>
              <span className="text-[11px] font-mono text-text-dim">
                Module {mod.num}
              </span>
              <h3 className="text-lg font-semibold text-text-muted">
                {mod.title}
              </h3>
              <p className="text-xs text-text-dim">Coming soon</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
