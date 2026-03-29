"use client";

import { useState } from "react";
import type { ChallengeBlock as ChallengeBlockType } from "@/types/story";

interface Props {
  block: ChallengeBlockType;
}

export function ChallengeBlock({ block }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const selectedOption = block.options.find((o) => o.id === selected);

  return (
    <div className="bg-surface rounded-2xl border border-accent/20 overflow-hidden">
      <div className="p-5 bg-accent-dim border-b border-accent/20">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-accent mb-3">
          Design Challenge
        </div>
        <p className="text-[15px] text-text/80 leading-relaxed mb-3">
          {block.scenario}
        </p>
        <p className="text-[15px] text-text font-semibold">{block.question}</p>
      </div>
      <div className="p-5 space-y-2">
        {block.options.map((option) => {
          const isSelected = selected === option.id;
          const showResult = revealed && isSelected;
          const isCorrect = option.correct;

          const showCorrectHint =
            revealed && !isSelected && option.correct;

          return (
            <button
              key={option.id}
              onClick={() => {
                if (!revealed) {
                  setSelected(option.id);
                }
              }}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                showResult
                  ? isCorrect
                    ? "border-green bg-green-dim"
                    : "border-pink bg-pink-dim"
                  : showCorrectHint
                  ? "border-green/40 bg-green-dim"
                  : isSelected
                  ? "border-accent bg-accent-dim"
                  : "border-border hover:border-text-dim/30 hover:bg-surface-hover"
              }`}
            >
              <span
                className={`text-[14px] ${
                  showResult
                    ? isCorrect
                      ? "text-green"
                      : "text-pink"
                    : isSelected
                    ? "text-accent"
                    : "text-text/70"
                }`}
              >
                {option.text}
              </span>
              {revealed && (isSelected || option.correct) && (
                <p className="text-[13px] text-text-muted leading-relaxed mt-2">
                  {option.explanation}
                </p>
              )}
            </button>
          );
        })}
      </div>

      {selected && !revealed && (
        <div className="px-5 pb-5">
          <button
            onClick={() => setRevealed(true)}
            className="w-full py-3 rounded-xl bg-accent text-white font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Submit Answer
          </button>
        </div>
      )}
    </div>
  );
}
