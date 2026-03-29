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
            className="label-mono text-text-muted hover:text-text transition-colors flex items-center gap-2"
          >
            <span>&larr;</span>
            <span className="hidden sm:inline">
              Module {mod.moduleNumber}: {mod.title}
            </span>
            <span className="sm:hidden">Back</span>
          </Link>
          <span className="label-mono text-text-dim">
            Lesson {lessonIndex + 1} of {mod.lessons.length}
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="label-mono text-text-muted">
              Lesson {lessonIndex + 1} of {mod.lessons.length}
            </span>
            <span className="label-mono text-text-dim">
              ~{lesson.estimatedMinutes} min
            </span>
          </div>
          <div className="h-[2px] bg-border overflow-hidden">
            <div
              className="h-full bg-text transition-all duration-500 ease-out"
              style={{
                width: `${((lessonIndex + 1) / mod.lessons.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Lesson header */}
        <div className="mb-10">
          <h1 className="heading-editorial text-3xl text-text mb-2">{lesson.title}</h1>
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
            <h3 className="label-mono text-text-dim mb-3">
              See This In Action
            </h3>
            <div className="space-y-2">
              {lesson.relatedStories.map((rel) => (
                <Link
                  key={`${rel.storySlug}-${rel.stageId}`}
                  href={`/stories/${rel.storySlug}?stage=${rel.stageId}`}
                  className="block bg-accent-dim border border-accent/20 p-4 hover:border-accent/40 transition-colors"
                >
                  <span className="text-sm text-accent font-medium font-mono">
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
              <span className="text-lg font-mono group-hover:-translate-x-1 transition-transform">
                &larr;
              </span>
              <div>
                <div className="label-mono text-text-dim">
                  Previous
                </div>
                <div className="text-sm font-bold uppercase">{prevLesson.title}</div>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextLesson ? (
            <Link
              href={`/curriculum/${mod.slug}/${nextLesson.id}`}
              className="group flex items-center gap-3 text-right text-text-muted hover:text-text transition-colors"
            >
              <div>
                <div className="label-mono text-text-dim">
                  Next Lesson
                </div>
                <div className="text-sm font-bold uppercase">{nextLesson.title}</div>
              </div>
              <span className="text-lg font-mono group-hover:translate-x-1 transition-transform">
                &rarr;
              </span>
            </Link>
          ) : (
            <Link
              href={`/curriculum/${mod.slug}`}
              className="flex items-center gap-2 px-5 py-2.5 bg-text text-bg font-bold font-mono text-[11px] tracking-[2px] uppercase hover:opacity-90 transition-opacity"
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
