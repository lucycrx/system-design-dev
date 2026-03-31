"use client";

import { useState, useEffect, useRef } from "react";

interface Props {
  value: string;
}

export function FlipCounter({ value }: Props) {
  const [current, setCurrent] = useState(value);
  const [prev, setPrev] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (value !== current) {
      setPrev(current);
      setCurrent(value);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setPrev(null), 400);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [value, current]);

  return (
    <span className="inline-block overflow-hidden h-[1.45em] align-bottom bg-text text-bg px-1.5 font-mono text-[11px] font-medium tracking-wider leading-[1.45] relative min-w-[1.6em] text-center">
      <span className="block relative">
        {prev !== null && (
          <span
            key={`out-${prev}`}
            className="absolute left-0 right-0 animate-[flipOut_0.3s_ease-in_forwards]"
          >
            {prev}
          </span>
        )}
        <span
          key={`in-${current}`}
          className={prev !== null ? "block animate-[flipIn_0.3s_ease-out_0.05s_both]" : ""}
        >
          {current}
        </span>
      </span>
      {/* Split-flap seam */}
      <span className="absolute left-0 right-0 top-1/2 h-px bg-bg/10 pointer-events-none" />
    </span>
  );
}
