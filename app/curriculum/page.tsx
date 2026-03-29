import { getAllStories, getAllModules } from "@/lib/content";
import { HomeContent } from "@/components/ui/HomeContent";

export default function CurriculumPage() {
  const stories = getAllStories();
  const modules = getAllModules();

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero */}
      <header className="max-w-5xl mx-auto px-6 pt-24 pb-16">
        <div className="mb-5">
          <span className="label-mono text-accent">
            System Design for Builders
          </span>
        </div>
        <h1 className="heading-editorial text-5xl sm:text-7xl lg:text-8xl text-text mb-8">
          Learn why
          <br />
          systems work
          <br />
          <span className="text-accent italic">(and why they break)</span>
        </h1>
        <p className="text-lg sm:text-xl text-text-muted max-w-lg leading-relaxed font-light">
          Interactive stories and structured lessons that teach system design to
          vibecoders, PMs, and founders — not just engineers prepping for
          interviews.
        </p>
      </header>

      <HomeContent stories={stories} modules={modules} initialTab="curriculum" />
    </div>
  );
}
