import { cn } from "@/utils";

type PersonalBestProps = {
  username?: string;
  personalBest?: number;
};

export const PersonalBest = ({
  username = "",
  personalBest = 0,
}: PersonalBestProps) => {
  return (
    <div
      className={cn(
        "mt-4 flex items-center justify-center gap-2 select-none transition-opacity duration-300",
        username && personalBest > 0
          ? "opacity-100"
          : "opacity-0 pointer-events-none",
      )}
    >
      <span className="font-display text-sm text-flag tracking-3xl uppercase">
        Your Best
      </span>
      <span className="font-mono text-lg font-bold tabular-nums text-flag">
        {personalBest}
      </span>
    </div>
  );
};
