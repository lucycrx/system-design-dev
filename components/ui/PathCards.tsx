"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Shape, type ShapeType } from "./Shape";

function PathCard({
  href,
  label,
  title,
  description,
  meta,
  accentColor,
  shape,
  offsetClass,
  delay,
}: {
  href: string;
  label: string;
  title: string;
  description: string;
  meta: string;
  accentColor: string;
  shape: ShapeType;
  offsetClass: string;
  delay: number;
}) {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div className={`relative ${offsetClass}`}>
      {/* Flat primary "Bauhaus shadow" offset block */}
      <div
        className="absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          backgroundColor: accentColor,
          transform: hovered ? "translate(12px, 12px)" : "translate(8px, 8px)",
        }}
      />
      <Link
        ref={ref}
        href={href}
        data-cursor
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group relative block border bg-bg p-8 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible
            ? hovered
              ? "translate(-4px, -4px)"
              : "translate(0, 0)"
            : "translateY(28px)",
          borderColor: hovered ? accentColor : "rgba(26,26,26,0.10)",
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <Shape type={shape} color={accentColor} size={20} />
          <span className="label-mono text-text-muted">{label}</span>
        </div>
        <h2 className="subhead text-2xl text-text mb-3">{title}</h2>
        <p className="text-[0.9375rem] text-text-muted leading-relaxed mb-8">
          {description}
        </p>
        <div className="flex items-center justify-between pt-5 border-t border-text/10">
          <span className="label-mono text-text-muted">{meta}</span>
          <span
            className="text-text text-lg font-mono transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5"
            style={{ color: hovered ? accentColor : undefined }}
          >
            &rarr;
          </span>
        </div>
      </Link>
    </div>
  );
}

export function PathCards({
  conceptCount,
  storyCount,
}: {
  conceptCount: number;
  storyCount: number;
}) {
  return (
    <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 items-start max-w-3xl">
      <PathCard
        href="/concepts"
        label="Reference"
        title="Concepts"
        description="The building blocks behind every app that scales — each in plain English, with a real-world analogy and an animated visual."
        meta={`${conceptCount} concepts`}
        accentColor="#1D4E89"
        shape="circle"
        offsetClass=""
        delay={0}
      />
      <PathCard
        href="/stories"
        label="Narrative"
        title="Build Stories"
        description="Follow a product from first deploy to production crisis. System design concepts arrive when the story demands them."
        meta={`${storyCount} ${storyCount === 1 ? "story" : "stories"}`}
        accentColor="#D62828"
        shape="square"
        offsetClass="sm:mt-12"
        delay={120}
      />
    </div>
  );
}
