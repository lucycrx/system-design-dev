import { notFound } from "next/navigation";
import Link from "next/link";
import { getModule, getAllModules } from "@/lib/content";
import { LessonSection } from "@/components/curriculum/LessonSection";
import { LessonQuiz } from "@/components/curriculum/LessonQuiz";

interface Props {
  params: Promise<{ moduleSlug: string; lessonId: string }>;
}

export default async function LessonPage({ params }: Props) {
  const { moduleSlug, lessonId } = await params;
  const mod = getModule(moduleSlug);
  if (!mod) notFound();

  const lessonIndex = mod.lessons.findIndex((l) => l.id === lessonId);
  if (lessonIndex === -1) notFound();

  const lesson = mod.lessons[lessonIndex];
  const prevLesson = lessonIndex > 0 ? mod.lessons[lessonIndex - 1] : undefined;
  const nextLesson =
    lessonIndex < mod.lessons.length - 1
      ? mod.lessons[lessonIndex + 1]
      : undefined;

  return (
    <div className="min-h-screen bg-bg">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-bg/90 backdrop-blur-md border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link
            href={`/curriculum/${mod.slug}`}
            className="text-sm text-text-muted hover:text-text transition-colors flex items-center gap-2"
          >
            <span>←</span>
            <span className="hidden sm:inline">
              Module {mod.moduleNumber}: {mod.title}
            </span>
            <span className="sm:hidden">Back</span>
          </Link>
          <span className="text-xs font-mono text-text-dim">
            Lesson {lessonIndex + 1} of {mod.lessons.length}
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-text-muted font-mono">
              Lesson {lessonIndex + 1} of {mod.lessons.length}
            </span>
            <span className="text-xs text-text-dim">
              ~{lesson.estimatedMinutes} min
            </span>
          </div>
          <div className="h-1 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-blue rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${((lessonIndex + 1) / mod.lessons.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Lesson header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-text mb-2">{lesson.title}</h1>
          <p className="text-text-muted leading-relaxed">
            {lesson.description}
          </p>
        </div>

        {/* What / Why / How / When sections */}
        {lesson.sections.map((section) => (
          <LessonSection key={section.heading} section={section} />
        ))}

        {/* Quiz */}
        <div className="mt-10 mb-8">
          <LessonQuiz quiz={lesson.quiz} />
        </div>

        {/* Related Build Stories */}
        {lesson.relatedStories && lesson.relatedStories.length > 0 && (
          <div className="mt-8 mb-8">
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-text-dim mb-3">
              See This In Action
            </h3>
            <div className="space-y-2">
              {lesson.relatedStories.map((rel) => (
                <Link
                  key={`${rel.storySlug}-${rel.stageId}`}
                  href={`/stories/${rel.storySlug}/${rel.stageId}`}
                  className="block bg-accent-dim border border-accent/20 rounded-xl p-4 hover:border-accent/40 transition-colors"
                >
                  <span className="text-sm text-accent font-medium">
                    {rel.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-12 pt-8 border-t border-border">
          {prevLesson ? (
            <Link
              href={`/curriculum/${mod.slug}/${prevLesson.id}`}
              className="group flex items-center gap-3 text-text-muted hover:text-text transition-colors"
            >
              <span className="text-lg group-hover:-translate-x-1 transition-transform">
                ←
              </span>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-text-dim">
                  Previous
                </div>
                <div className="text-sm font-medium">{prevLesson.title}</div>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextLesson ? (
            <Link
              href={`/curriculum/${mod.slug}/${nextLesson.id}`}
              className="group flex items-center gap-3 text-right text-text-muted hover:text-blue transition-colors"
            >
              <div>
                <div className="text-[11px] uppercase tracking-wider text-text-dim">
                  Next Lesson
                </div>
                <div className="text-sm font-medium">{nextLesson.title}</div>
              </div>
              <span className="text-lg group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          ) : (
            <Link
              href={`/curriculum/${mod.slug}`}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue text-white rounded-full font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Complete Module
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}

export async function generateStaticParams() {
  const modules = getAllModules();
  const params: { moduleSlug: string; lessonId: string }[] = [];
  for (const mod of modules) {
    for (const lesson of mod.lessons) {
      params.push({ moduleSlug: mod.slug, lessonId: lesson.id });
    }
  }
  return params;
}
