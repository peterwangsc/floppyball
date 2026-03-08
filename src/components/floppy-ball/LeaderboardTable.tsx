import { memo } from "react";
import { useSupabase } from "@/hooks/useSupabase";
import { formatDate } from "@/utils";

function LeaderboardTableComponent() {
  const { leaderboards } = useSupabase();
  return (
    <>
      <div className="mx-auto mt-6 w-full max-w-[560px] border-b-2 border-b-green-500 pb-1 text-center text-xl font-bold select-none">
        Leaderboard
      </div>

      <div className="mx-auto mb-10 w-full max-w-[560px] overflow-hidden rounded-xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
        <table className="w-full border-collapse text-center">
          <thead className="bg-green-500 text-white">
          <tr>
            <th className="p-2">Rank</th>
            <th className="p-2">Player</th>
            <th className="p-2">Score</th>
            <th className="p-2">Date</th>
          </tr>
          </thead>
          <tbody>
            {leaderboards.map((entry, i) => (
              <tr
                key={`${entry.createdAt}-${entry.name}-${i}`}
                className={i === 0 ? "bg-yellow-50" : "bg-white"}
              >
                <td className="p-3 font-bold">{i + 1}</td>
                <td className="p-3">{entry.name}</td>
                <td className="p-3 font-bold text-green-700">
                {entry.score.toFixed(0)}
                </td>
                <td className="p-3 text-sm text-gray-500">
                  {formatDate(entry.createdAt)}
                </td>
              </tr>
            ))}
            {leaderboards.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 italic text-gray-500">
                  No scores yet. Set the record!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export const LeaderboardTable = memo(LeaderboardTableComponent);
