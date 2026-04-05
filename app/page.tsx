import { getAllStories, getAllModules } from "@/lib/content";
import { ProductHero } from "@/components/landing/ProductHero";
import { WorksWith } from "@/components/landing/WorksWith";
import { ValueProps } from "@/components/landing/ValueProps";
import { Personas } from "@/components/landing/Personas";
import { InstallSection } from "@/components/landing/InstallSection";
import { ExampleOutput } from "@/components/landing/ExampleOutput";
import { FAQ } from "@/components/landing/FAQ";
import { FooterCTA } from "@/components/landing/FooterCTA";
import { PathCards } from "@/components/ui/PathCards";
import { SectionNumber } from "@/components/landing/SectionNumber";

export default function HomePage() {
  const stories = getAllStories();
  const modules = getAllModules();
  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);

  return (
    <div className="min-h-screen bg-bg">
      <ProductHero />
      <WorksWith />

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="border-t border-border" />
      </div>

      <ValueProps />
      <ExampleOutput />
      <Personas />
      <InstallSection />

      {/* Go Deeper — demoted learning content */}
      <section className="max-w-5xl mx-auto px-6 py-16 sm:py-24">
        <div className="flex items-baseline gap-5 mb-4">
          <SectionNumber number="05" />
          <h2 className="heading-editorial text-xl sm:text-2xl lg:text-[1.75rem] text-text">
            Want to Go Deeper?
          </h2>
        </div>
        <p className="font-mono text-[13px] text-text-muted leading-relaxed mb-10 max-w-lg">
          The map shows what&apos;s there and what&apos;s wrong. These
          resources explain why.
        </p>

        <PathCards
          storyCount={stories.length}
          moduleCount={modules.length}
          lessonCount={totalLessons}
        />
      </section>

      <FAQ />

      {/* Footer CTA */}
      <div className="px-6 pb-0">
        <FooterCTA />
      </div>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 pt-8 pb-12 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="label-mono text-text-dim">system-design-school</span>
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/lucycrx/architecture-review"
              className="relative label-mono text-text-dim hover:text-text transition-colors duration-200 group"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-current transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-full" />
            </a>
            <a
              href="https://github.com/lucycrx/architecture-review/issues"
              className="relative label-mono text-text-dim hover:text-text transition-colors duration-200 group"
              target="_blank"
              rel="noopener noreferrer"
            >
              Feedback
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-current transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-full" />
            </a>
          </div>
        </div>
        <p className="font-mono text-[11px] text-text-dim/50 mt-4">
          &copy; 2026 System Design School. Built with Claude Code.
        </p>
      </footer>
    </div>
  );
}
