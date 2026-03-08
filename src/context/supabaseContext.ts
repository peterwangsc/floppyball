import { createContext } from "react";
import type { LeaderboardEntry } from "@/utils";

export type SupabaseContextValue = {
  isConfigured: boolean;
  isLoading: boolean;
  leaderboards: LeaderboardEntry[];
  refreshLeaderboard: () => Promise<void>;
  fetchPersonalBest: (name: string) => Promise<number>;
  submitScore: (name: string, score: number) => Promise<boolean>;
};

export const SupabaseContext = createContext<SupabaseContextValue | null>(null);
