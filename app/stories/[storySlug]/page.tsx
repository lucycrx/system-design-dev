import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getStory, getDiagrams, getGlossaryMap } from "@/lib/content";
import { StoryPage } from "@/components/story/StoryPage";

interface Props {
  params: Promise<{ storySlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { storySlug } = await params;
  const story = getStory(storySlug);
  if (!story) return { title: "Story Not Found" };
  return {
    title: story.title,
    description: story.description,
    alternates: { canonical: `/stories/${story.slug}` },
  };
}

export default async function StoryOverviewPage({ params }: Props) {
  const { storySlug } = await params;
  const story = getStory(storySlug);
  if (!story) notFound();

  const allDiagrams = getDiagrams(storySlug);
  const glossaryMap = getGlossaryMap();

  return (
    <Suspense>
      <StoryPage
        story={story}
        allDiagrams={allDiagrams}
        glossaryMap={glossaryMap}
      />
    </Suspense>
  );
}

export async function generateStaticParams() {
  const { getAllStories } = await import("@/lib/content");
  return getAllStories().map((s) => ({ storySlug: s.slug }));
}
