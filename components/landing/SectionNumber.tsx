export function SectionNumber({ number }: { number: string }) {
  return (
    <span className="font-mono text-[3.5rem] sm:text-[4.5rem] font-bold text-text/[0.08] leading-none select-none tracking-tight">
      {number}
    </span>
  );
}
