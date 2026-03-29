"use client";

import { useState } from "react";
import type { Lesson } from "@/types/story";

interface Props {
  quiz: Lesson["quiz"];
}

export function LessonQuiz({ quiz }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="bg-surface border border-purple/20 overflow-hidden">
      <div className="p-5 bg-purple-dim border-b border-purple/20">
        <div className="label-mono text-purple mb-3">
          Check Your Understanding
        </div>
        <p className="text-sm text-text/80 leading-relaxed mb-2">
          {quiz.scenario}
        </p>
        <p className="text-base text-text font-bold">{quiz.question}</p>
      </div>
      <div className="p-4 space-y-2">
        {quiz.options.map((option) => {
          const isSelected = selected === option.id;
          const showResult = revealed && isSelected;
          const isCorrect = option.correct;
          const showCorrectHint = revealed && !isSelected && option.correct;

          return (
            <button
              key={option.id}
              onClick={() => {
                if (!revealed) setSelected(option.id);
              }}
              className={`w-full text-left p-4 border transition-all ${
                showResult
                  ? isCorrect
                    ? "border-green bg-green-dim"
                    : "border-pink bg-pink-dim"
                  : showCorrectHint
                  ? "border-green/40 bg-green-dim"
                  : isSelected
                  ? "border-purple bg-purple-dim"
                  : "border-border hover:border-text-dim/30 hover:bg-surface-hover"
              }`}
            >
              <span
                className={`text-sm ${
                  showResult
                    ? isCorrect
                      ? "text-green"
                      : "text-pink"
                    : isSelected
                    ? "text-purple"
                    : "text-text/70"
                }`}
              >
                {option.text}
              </span>
              {revealed && (isSelected || option.correct) && (
                <p className="text-sm text-text-muted leading-relaxed mt-2">
                  {option.explanation}
                </p>
              )}
            </button>
          );
        })}
      </div>

      {selected && !revealed && (
        <div className="px-4 pb-4">
          <button
            onClick={() => setRevealed(true)}
            className="w-full py-3 bg-purple text-white font-bold font-mono text-[11px] tracking-[2px] uppercase hover:opacity-90 transition-opacity"
          >
            Check Answer
          </button>
        </div>
      )}
    </div>
  );
}
