import type { MetadataRoute } from "next";
import { getAllStories, getAllModules, getGlossaryTerms } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${SITE_URL}${path}`;

  const staticRoutes = ["/", "/example", "/concepts", "/stories", "/curriculum"].map(
    (path) => ({
      url: url(path),
      changeFrequency: "monthly" as const,
      priority: path === "/" ? 1 : 0.8,
    })
  );

  const conceptRoutes = getGlossaryTerms().map((t) => ({
    url: url(`/concepts/${t.id}`),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const storyRoutes = getAllStories().map((s) => ({
    url: url(`/stories/${s.slug}`),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const curriculumRoutes = getAllModules().flatMap((m) => [
    {
      url: url(`/curriculum/${m.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    ...m.lessons.map((l) => ({
      url: url(`/curriculum/${m.slug}/${l.id}`),
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
  ]);

  return [...staticRoutes, ...conceptRoutes, ...storyRoutes, ...curriculumRoutes];
}
