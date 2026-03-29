import { notFound } from "next/navigation";
import Link from "next/link";
import { getModule, getAllModules } from "@/lib/content";

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

const MODULE_BG_FULL_COLORS: Record<string, string> = {
  accent: "bg-accent",
  blue: "bg-blue",
  green: "bg-green",
  orange: "bg-orange",
  pink: "bg-pink",
  purple: "bg-purple",
};

const MODULE_BORDER_COLORS: Record<string, string> = {
  accent: "border-accent/20",
  blue: "border-blue/20",
  green: "border-green/20",
  orange: "border-orange/20",
  pink: "border-pink/20",
  purple: "border-purple/20",
};

interface Props {
  params: Promise<{ moduleSlug: string }>;
}

export default async function ModulePage({ params }: Props) {
  const { moduleSlug } = await params;
  const mod = getModule(moduleSlug);
  if (!mod) notFound();

  const totalMinutes = mod.lessons.reduce(
    (sum, l) => sum + l.estimatedMinutes,
    0
  );

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link
            href="/curriculum"
            className="label-mono text-text-muted hover:text-text transition-colors flex items-center gap-2"
          >
            <span>&larr;</span> All Modules
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span
              className={`text-sm font-bold font-mono text-bg ${MODULE_BG_FULL_COLORS[mod.color]} w-12 h-12 flex items-center justify-center`}
            >
              {mod.moduleNumber}
            </span>
            <div>
              <span
                className={`label-mono ${MODULE_TEXT_COLORS[mod.color]} font-medium`}
              >
                Module {mod.moduleNumber}
              </span>
              <div className="label-mono text-text-dim">
                {mod.lessons.length} lessons &middot; ~{totalMinutes} min total
              </div>
            </div>
          </div>
          <h1 className="heading-editorial text-3xl text-text mb-2">{mod.title}</h1>
          <p className="text-text-muted leading-relaxed">{mod.description}</p>
        </div>

        {/* Lessons list */}
        <div className="space-y-3">
          {mod.lessons.map((lesson, i) => (
            <Link
              key={lesson.id}
              href={`/curriculum/${mod.slug}/${lesson.id}`}
              className={`group block bg-surface border ${MODULE_BORDER_COLORS[mod.color]} p-5 hover:border-text/30 transition-all`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex-shrink-0 w-8 h-8 ${MODULE_BG_COLORS[mod.color]} border ${MODULE_BORDER_COLORS[mod.color]} flex items-center justify-center ${MODULE_TEXT_COLORS[mod.color]} text-sm font-bold font-mono`}
                >
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-text group-hover:text-accent transition-colors tracking-[-0.01em] uppercase">
                    {lesson.title}
                  </h3>
                  <p className="text-sm text-text-muted mt-0.5 leading-relaxed">
                    {lesson.description}
                  </p>
                  <span className="label-mono text-text-dim mt-2 inline-block">
                    ~{lesson.estimatedMinutes} min
                  </span>
                </div>
                <span className="text-text-dim group-hover:text-accent transition-colors text-lg font-mono">
                  &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Start button */}
        <div className="mt-8">
          <Link
            href={`/curriculum/${mod.slug}/${mod.lessons[0].id}`}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-text text-bg font-bold font-mono text-[13px] tracking-[2px] uppercase hover:opacity-90 transition-opacity"
          >
            Start Module &rarr;
          </Link>
        </div>
      </main>
    </div>
  );
}

export async function generateStaticParams() {
  return getAllModules().map((m) => ({ moduleSlug: m.slug }));
}
