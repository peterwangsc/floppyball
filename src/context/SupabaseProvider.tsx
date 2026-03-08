import { useEffect, useState, type ReactNode } from "react";
import type { LeaderboardEntry } from "@/utils";
import {
  fetchPersonalBest,
  fetchLeaderboardEntries,
  insertLeaderboardEntry,
  supabase,
} from "@/lib/supabase";
import { SupabaseContext } from "./supabaseContext";

const LEADERBOARD_LIMIT = 10;
let cachedLeaderboards: LeaderboardEntry[] | undefined;
let leaderboardLoadPromise: Promise<LeaderboardEntry[]> | null = null;

const updateLeaderboardCache = (entries: LeaderboardEntry[]) => {
  cachedLeaderboards = entries;
  leaderboardLoadPromise = Promise.resolve(entries);
};

const loadLeaderboardsOnce = () => {
  if (cachedLeaderboards !== undefined) {
    return Promise.resolve(cachedLeaderboards);
  }

  if (!leaderboardLoadPromise) {
    leaderboardLoadPromise = fetchLeaderboardEntries(LEADERBOARD_LIMIT)
      .then((entries) => {
        const nextEntries = entries ?? [];
        updateLeaderboardCache(nextEntries);
        return nextEntries;
      })
      .catch(() => {
        updateLeaderboardCache([]);
        return [];
      });
  }

  return leaderboardLoadPromise;
};

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const [leaderboards, setLeaderboards] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshLeaderboard = async () => {
    const entries = await fetchLeaderboardEntries(LEADERBOARD_LIMIT);
    if (!entries) {
      setIsLoading(false);
      return;
    }

    updateLeaderboardCache(entries);
    setLeaderboards(entries);
    setIsLoading(false);
  };

  const submitScore = async (name: string, score: number) => {
    const trimmedName = name.trim();
    if (!trimmedName || score <= 0) {
      return false;
    }

    const saved = await insertLeaderboardEntry(trimmedName, score);
    if (!saved) {
      return false;
    }

    await refreshLeaderboard();
    return true;
  };

  useEffect(() => {
    let cancelled = false;

    void loadLeaderboardsOnce().then((entries) => {
      if (cancelled) {
        return;
      }

      setLeaderboards(entries);
      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SupabaseContext.Provider
      value={{
        isConfigured: Boolean(supabase),
        isLoading,
        leaderboards,
        refreshLeaderboard,
        fetchPersonalBest,
        submitScore,
      }}
    >
      {children}
    </SupabaseContext.Provider>
  );
}
