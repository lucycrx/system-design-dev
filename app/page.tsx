import { getAllStories, getAllModules } from "@/lib/content";
import { HomeContent } from "@/components/ui/HomeContent";

export default function HomePage() {
  const stories = getAllStories();
  const modules = getAllModules();

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero */}
      <header className="max-w-4xl mx-auto px-6 pt-28 pb-24">
        <div className="mb-5">
          <span className="text-[11px] font-mono text-accent font-medium uppercase tracking-[3px]">
            System Design for Builders
          </span>
        </div>
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold text-text leading-[1.04] mb-8">
          Learn why
          <br />
          systems work
          <br />
          <span className="text-accent font-bold italic">(and why they break)</span>
        </h1>
        <p className="text-lg sm:text-xl text-text-muted max-w-lg leading-relaxed font-light">
          Interactive stories and structured lessons that teach system design to
          vibecoders, PMs, and founders — not just engineers prepping for
          interviews.
        </p>
      </header>

      <HomeContent stories={stories} modules={modules} initialTab="stories" />
    </div>
  );
}
