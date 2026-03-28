"use client";

import { useState } from "react";
import type { CheckpointBlock as CheckpointBlockType } from "@/types/story";

interface Props {
  block: CheckpointBlockType;
}

export function CheckpointBlock({ block }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const selectedOption = block.options.find((o) => o.id === selected);

  return (
    <div className="my-8 bg-surface rounded-2xl border border-border overflow-hidden">
      <div className="p-5 border-b border-border">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-purple mb-2">
          Quick Check
        </div>
        <p className="text-[15px] text-text font-medium leading-relaxed">
          {block.question}
        </p>
      </div>
      <div className="p-4 space-y-2">
        {block.options.map((option) => {
          const isSelected = selected === option.id;
          const showResult = revealed && isSelected;
          const isCorrect = option.correct;

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
            </button>
          );
        })}
      </div>

      {selected && !revealed && (
        <div className="px-4 pb-4">
          <button
            onClick={() => setRevealed(true)}
            className="w-full py-3 rounded-xl bg-accent text-white font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Check Answer
          </button>
        </div>
      )}

      {revealed && selectedOption && (
        <div
          className={`mx-4 mb-4 p-4 rounded-xl ${
            selectedOption.correct ? "bg-green-dim" : "bg-pink-dim"
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-sm font-semibold ${
                selectedOption.correct ? "text-green" : "text-pink"
              }`}
            >
              {selectedOption.correct ? "Correct" : "Not quite"}
            </span>
          </div>
          <p className="text-[13px] text-text/70 leading-relaxed">
            {selectedOption.explanation}
          </p>
        </div>
      )}
    </div>
  );
}
