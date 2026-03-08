export type GameState = "start" | "playing" | "gameover";

export type Bird = {
  x: number;
  y: number;
  velocity: number;
  width: number;
  height: number;
};

export type Pipe = {
  x: number;
  topHeight: number;
  bottomY: number;
  passed: boolean;
};

export type LeaderboardEntry = {
  name: string;
  score: number;
  createdAt: string;
};
