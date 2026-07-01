type Props = {
  className?: string;
};

/** Floating sticker seal — lives outside document flow in the hero. */
export function JobsHeroLiveJobsRoundelV3({ className = "" }: Props) {
  return (
    <div
      className={`pointer-events-none absolute z-20 ${className}`}
      role="img"
      aria-label="Over 300 live jobs"
    >
      <div className="flex h-[68px] w-[68px] rotate-[11deg] flex-col items-center justify-center rounded-full border border-[#235A0E]/20 bg-white/90 shadow-[0_10px_28px_rgba(35,90,14,0.14),0_0_0_6px_rgba(35,90,14,0.05)] backdrop-blur-[2px] sm:h-[76px] sm:w-[76px] sm:rotate-[15deg]">
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#235A0E]/75">
          Over
        </span>
        <span className="-mt-0.5 text-[21px] font-semibold leading-none tracking-tight text-[#235A0E] sm:text-[23px]">
          300+
        </span>
        <span className="mt-1 text-[7px] font-semibold uppercase tracking-[0.16em] text-[#235A0E]/70 sm:text-[8px]">
          Live jobs
        </span>
      </div>
    </div>
  );
}
