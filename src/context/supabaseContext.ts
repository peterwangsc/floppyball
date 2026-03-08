import { createContext } from "react";
import type { LeaderboardEntry } from "@/components/floppy-ball/types";

export type SupabaseContextValue = {
  isConfigured: boolean;
  isLoading: boolean;
  leaderboards: LeaderboardEntry[];
  refreshLeaderboard: () => Promise<void>;
  submitScore: (name: string, score: number) => Promise<boolean>;
};

export const SupabaseContext = createContext<SupabaseContextValue | null>(null);
