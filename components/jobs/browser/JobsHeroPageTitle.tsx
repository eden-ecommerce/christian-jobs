type Props = {
  variant?: "default" | "onImage";
};

/** Page H1 for jobs homepage heroes — SEO heading, visually secondary to the tagline. */
export function JobsHeroPageTitle({ variant = "default" }: Props) {
  const isOnImage = variant === "onImage";

  return (
    <h1
      className={`font-semibold uppercase tracking-[0.12em] ${
        isOnImage
          ? "text-[14px] text-white/90 sm:text-[15px]"
          : "text-[14px] text-[#235A0E] sm:text-[15px]"
      }`}
    >
      Christian Jobs
    </h1>
  );
}
