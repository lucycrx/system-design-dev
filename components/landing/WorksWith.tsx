"use client";

import { useEffect, useRef, useState } from "react";

const FRAMEWORKS = [
  {
    name: "Claude Code",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
        <path d="M12 19h8M4 17l6-6-6-6" />
      </svg>
    ),
  },
  {
    name: "Next.js",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="currentColor" d="M18.665 21.978A11.94 11.94 0 0 1 12 24C5.377 24 0 18.623 0 12S5.377 0 12 0s12 5.377 12 12c0 3.583-1.574 6.801-4.067 9.001L9.219 7.2H7.2v9.596h1.615V9.251zm-3.332-8.533l1.6 2.061V7.2h-1.6z" />
      </svg>
    ),
  },
  {
    name: "Django",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="currentColor" d="M11.146 0h3.924v18.166c-2.013.382-3.491.535-5.096.535c-4.791 0-7.288-2.166-7.288-6.32c0-4.002 2.65-6.6 6.753-6.6c.637 0 1.121.05 1.707.203zm0 9.143a3.9 3.9 0 0 0-1.325-.204c-1.988 0-3.134 1.223-3.134 3.365c0 2.09 1.096 3.236 3.109 3.236c.433 0 .79-.025 1.35-.102V9.142zM21.314 6.06v9.098c0 3.134-.229 4.638-.917 5.937c-.637 1.249-1.478 2.039-3.211 2.905l-3.644-1.733c1.733-.815 2.574-1.53 3.109-2.625c.561-1.121.739-2.421.739-5.835V6.059zM17.39.021h3.924v4.026H17.39z" />
      </svg>
    ),
  },
  {
    name: "Rails",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="currentColor" d="M.741 19.365h8.36s-1.598-7.291 3.693-10.243l.134-.066c1.286-.637 4.907-2.431 10.702 1.854c.19-.159.37-.286.37-.286s-5.503-5.492-11.63-4.878c-3.079.275-6.867 3.079-9.09 6.783S.741 19.365.741 19.365m8.804-.783a11 11 0 0 1-.127-1.333l1.143.412c.063.498.159.963.254 1.376zm-7.799-4.317L.529 13.82c-.201.455-.423.984-.529 1.27l1.217.444c.137-.359.36-.878.529-1.269m7.831.296l.857.677q.063-.619.222-1.238l-.762-.603c-.137.391-.233.783-.317 1.164m2.042-2.646l-.508-.762c.191-.243.413-.486.656-.709l.476.72a6 6 0 0 0-.624.751M4.19 8.878l.752.656c-.254.265-.498.551-.72.836l-.815-.698c.244-.265.508-.529.783-.794m9.799 1.027l-.243-.73c.265-.117.571-.233.931-.339l.233.698a7 7 0 0 0-.921.371m3.122-.656l.042-.667c.339.021.688.064 1.048.138l-.042.656a6 6 0 0 0-1.048-.127M8.942 6.392l-.476-.731c-.265.138-.54.286-.826.455l.487.741c.275-.169.54-.328.815-.465m9.217-.053l.042-.709c-.095-.053-.36-.18-1.026-.371l-.043.699c.349.116.688.243 1.027.381M13.238 5.28h.106l-.212-.645q-.492 0-1.016.063l.201.625a9 9 0 0 1 .921-.043" />
      </svg>
    ),
  },
  {
    name: "Express",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="currentColor" d="M24 18.588a1.53 1.53 0 0 1-1.895-.72l-3.45-4.771l-.5-.667l-4.003 5.444a1.466 1.466 0 0 1-1.802.708l5.158-6.92l-4.798-6.251a1.595 1.595 0 0 1 1.9.666l3.576 4.83l3.596-4.81a1.435 1.435 0 0 1 1.788-.668L21.708 7.9l-2.522 3.283a.666.666 0 0 0 0 .994l4.804 6.412zM.002 11.576l.42-2.075c1.154-4.103 5.858-5.81 9.094-3.27c1.895 1.489 2.368 3.597 2.275 5.973H1.116C.943 16.447 4.005 19.009 7.92 17.7a4.08 4.08 0 0 0 2.582-2.876c.207-.666.548-.78 1.174-.588a5.42 5.42 0 0 1-2.589 3.957a6.27 6.27 0 0 1-7.306-.933a6.58 6.58 0 0 1-1.64-3.858c0-.235-.08-.455-.134-.666A88 88 0 0 1 0 11.577zm1.127-.286h9.654c-.06-3.076-2.001-5.258-4.59-5.278c-2.882-.04-4.944 2.094-5.071 5.264z" />
      </svg>
    ),
  },
  {
    name: "+ any codebase",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 12h8M12 8v8" />
      </svg>
    ),
  },
];

function FrameworkItem({ fw }: { fw: (typeof FRAMEWORKS)[0] }) {
  return (
    <div className="flex items-center gap-3 text-text-muted flex-shrink-0 px-8">
      <span className="opacity-50">{fw.icon}</span>
      <span className="font-mono text-[13px] tracking-wide whitespace-nowrap">
        {fw.name}
      </span>
    </div>
  );
}

export function WorksWith() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="max-w-5xl mx-auto px-6 py-10 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
      }}
    >
      <p className="label-mono text-text-dim mb-6 text-center">Works with</p>
      <div className="relative overflow-hidden">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-bg to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-bg to-transparent z-10 pointer-events-none" />

        {/* Scrolling track — duplicated for seamless loop */}
        <div
          className="flex items-center"
          style={{ animation: "marquee 25s linear infinite" }}
        >
          {FRAMEWORKS.map((fw) => (
            <FrameworkItem key={fw.name} fw={fw} />
          ))}
          {FRAMEWORKS.map((fw) => (
            <FrameworkItem key={`dup-${fw.name}`} fw={fw} />
          ))}
        </div>
      </div>
    </div>
  );
}
