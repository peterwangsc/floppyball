import { cn } from "@/utils";

type LeaderboardToggleProps = {
  showLeaderboard: boolean;
  onToggle: () => void;
};

export function LeaderboardToggle({ showLeaderboard, onToggle }: LeaderboardToggleProps) {
  return (
    <div className="mt-3 flex justify-center">
      <button
        onClick={onToggle}
        className={cn(
          "flex items-center gap-2 rounded-full border px-6 py-2 transition-all duration-200 active:scale-95",
          showLeaderboard
            ? "bg-linear-to-b from-btn-green to-btn-dark border-flag/70 hover:border-flag"
            : "bg-white/5 border-flag/40 hover:border-flag/70",
        )}
      >
        <span className="text-base">{showLeaderboard ? "▶" : "🏆"}</span>
        <span className={cn(
          "font-display text-sm tracking-2xl uppercase",
          showLeaderboard ? "text-white" : "text-flag",
        )}>
          {showLeaderboard ? "Play" : "Leaderboard"}
        </span>
      </button>
    </div>
  );
}
