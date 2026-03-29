import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getStory, getDiagrams, getGlossaryMap } from "@/lib/content";
import { StoryPage } from "@/components/story/StoryPage";

interface Props {
  params: Promise<{ storySlug: string }>;
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
