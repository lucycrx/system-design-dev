export function SectionNumber({ number }: { number: string }) {
  return (
    <span className="font-mono text-[3rem] sm:text-[4rem] font-bold text-text/[0.06] leading-none select-none tracking-tight">
      {number}
    </span>
  );
}
