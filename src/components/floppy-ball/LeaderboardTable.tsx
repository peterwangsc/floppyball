import { memo } from "react";
import { useSupabase } from "@/hooks/useSupabase";
import { formatDate, cn } from "@/utils";

const MEDALS = ["🥇", "🥈", "🥉"];

function LeaderboardTableComponent() {
  const { leaderboards } = useSupabase();

  return (
    <div className="h-full flex flex-col">
      <div className="shrink-0 px-4 pt-4 pb-3 flex items-center gap-3 select-none bg-leaderboard-header">
        <div className="h-px flex-1 bg-flag/25" />
        <span className="font-display text-flag text-eyebrow tracking-3xl uppercase">
          Leaderboard
        </span>
        <div className="h-px flex-1 bg-flag/25" />
      </div>

      <div className="flex-1 overflow-y-auto bg-scorecard">
        <table className="w-full border-collapse text-center">
          <thead>
            <tr className="text-flag sticky top-0 bg-pine-mid">
              {(["#", "PLAYER", "SCORE", "DATE"] as const).map((label, i) => (
                <th
                  key={label}
                  className={cn(
                    "font-display py-2.5 px-2 text-2xs tracking-2xl font-normal",
                    i === 0 && "w-10",
                    i === 1 && "text-left",
                  )}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leaderboards.map((entry, i) => {
              const rowBg =
                i === 0
                  ? "bg-gold-tint"
                  : i % 2 === 0
                    ? "bg-scorecard"
                    : "bg-scorecard-alt";
              const scoreFg = i === 0 ? "text-gold-score" : "text-pine";
              return (
                <tr
                  key={`${entry.createdAt}-${entry.name}-${i}`}
                  className={cn("border-b border-tan/20 last:border-0", rowBg)}
                >
                  <td className="font-mono py-3 px-2 text-sm">
                    {i < 3 ? (
                      MEDALS[i]
                    ) : (
                      <span className="text-sand">{i + 1}</span>
                    )}
                  </td>
                  <td className="font-mono py-3 px-2 text-sm text-left font-medium text-rough max-w-25 truncate">
                    {entry.name}
                  </td>
                  <td
                    className={cn(
                      "font-mono py-3 px-2 text-sm font-bold tabular-nums",
                      scoreFg,
                    )}
                  >
                    {entry.score.toFixed(0)}
                  </td>
                  <td className="font-mono py-3 px-2 text-xs text-sand-light">
                    {formatDate(entry.createdAt)}
                  </td>
                </tr>
              );
            })}
            {leaderboards.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="font-mono py-8 px-4 text-sm italic text-center text-sand-light bg-scorecard"
                >
                  No scores yet — set the record!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const LeaderboardTable = memo(LeaderboardTableComponent);
