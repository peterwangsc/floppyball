import { useCallback, useEffect, useRef, useState } from "react";
import { Game } from "@/lib/Game";
import { useSupabase } from "@/hooks/useSupabase";
import { AssetPreloads } from "@/components/floppy-ball/AssetPreloads";
import { GameCanvas } from "@/components/floppy-ball/GameCanvas";
import { GameOverOverlay } from "@/components/floppy-ball/GameOverOverlay";
import { LeaderboardTable } from "@/components/floppy-ball/LeaderboardTable";
import { LeaderboardToggle } from "@/components/floppy-ball/LeaderboardToggle";
import { StartOverlay } from "@/components/floppy-ball/StartOverlay";
import { PersonalBest } from "@/components/floppy-ball/PersonalBest";
import { cn } from "@/utils";
import type { GameState } from "@/utils";

const ANONYMOUS_PERSONAL_BEST_KEY = "floppyball:anonymousPersonalBest";

export function FloppyBall() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgImgRef = useRef<HTMLImageElement>(null);
  const birdImgRef = useRef<HTMLImageElement>(null);
  const pipeTopImgRef = useRef<HTMLImageElement>(null);
  const pipeBottomImgRef = useRef<HTMLImageElement>(null);
  const [gameState, setGameState] = useState<GameState>("start");
  const [finalScore, setFinalScore] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [, setUsername] = useState<string | undefined>();
  const [personalBest, setPersonalBest] = useState(0);
  const usernameRef = useRef<string | undefined>(undefined);
  const { fetchPersonalBest, submitScore } = useSupabase();
  const handleScoreSubmit = useCallback(
    async (name: string | undefined, score: number) => {
      if (!name) {
        const storedBest = Number(
          window.sessionStorage.getItem(ANONYMOUS_PERSONAL_BEST_KEY) ?? "0",
        );
        const nextBest = Math.max(
          Number.isFinite(storedBest) ? storedBest : 0,
          score,
        );
        window.sessionStorage.setItem(
          ANONYMOUS_PERSONAL_BEST_KEY,
          nextBest.toString(),
        );
        return true;
      }

      return submitScore(name, score);
    },
    [submitScore],
  );
  const [game] = useState(
    () =>
      new Game({
        canvasRef,
        bgImgRef,
        birdImgRef,
        pipeTopImgRef,
        pipeBottomImgRef,
        submitScore: handleScoreSubmit,
        onGameStateChange: (nextGameState, score) => {
          setGameState(nextGameState);
          if (nextGameState === "playing") setShowLeaderboard(false);
          if (typeof score === "number") {
            setFinalScore(score);
            if (score > 0) setPersonalBest((prev) => Math.max(prev, score));
          }
        },
      }),
  );

  const handleJump = useCallback(() => {
    game.jump();
  }, [game]);

  const handleStart = useCallback(
    (name?: string) => {
      const trimmedName = name?.trim();
      const nextUsername = trimmedName || undefined;
      usernameRef.current = nextUsername;
      game.setUsername(nextUsername);
      setUsername(nextUsername);
      setPersonalBest(0);
      if (!nextUsername) {
        const storedBest = Number(
          window.sessionStorage.getItem(ANONYMOUS_PERSONAL_BEST_KEY) ?? "0",
        );
        setPersonalBest(Number.isFinite(storedBest) ? storedBest : 0);
      } else {
        void fetchPersonalBest(nextUsername).then((bestScore) => {
          if (usernameRef.current === nextUsername) {
            setPersonalBest(bestScore);
          }
        });
      }
      game.jump();
    },
    [fetchPersonalBest, game],
  );

  useEffect(() => {
    game.render();
    game.mount();
    return () => {
      game.destroy();
    };
  }, [game]);

  const isPlaying = gameState === "playing";

  return (
    <div className="mx-auto w-full max-w-100 px-3 pt-4 pb-12">
      <AssetPreloads
        bgImgRef={bgImgRef}
        birdImgRef={birdImgRef}
        pipeTopImgRef={pipeTopImgRef}
        pipeBottomImgRef={pipeBottomImgRef}
      />

      <div className="mx-auto w-full max-w-100">
        <div className="mb-2.5 flex items-center justify-center gap-3 select-none">
          <div className="h-px flex-1 bg-flag/30" />
          <span className="font-display text-flag text-xs tracking-4xl uppercase">
            ⛳ Floppy Ball ⛳
          </span>
          <div className="h-px flex-1 bg-flag/30" />
        </div>

        <div className="relative w-full aspect-2/3 rounded-canvas overflow-hidden shadow-canvas">
          <div
            className={cn(
              "absolute inset-0 transition-opacity duration-300",
              showLeaderboard ? "opacity-0 pointer-events-none" : "opacity-100",
            )}
          >
            <GameCanvas canvasRef={canvasRef} onJump={handleJump} />
            {gameState === "start" && <StartOverlay onStart={handleStart} />}
            {gameState === "gameover" && (
              <GameOverOverlay score={finalScore} onRetry={handleJump} />
            )}
          </div>

          <div
            className={cn(
              "absolute inset-0 transition-opacity duration-300",
              showLeaderboard ? "opacity-100" : "opacity-0 pointer-events-none",
            )}
          >
            <LeaderboardTable />
          </div>
        </div>
        <PersonalBest personalBest={personalBest} />
        {!isPlaying && (
          <LeaderboardToggle
            showLeaderboard={showLeaderboard}
            onToggle={() => setShowLeaderboard((v) => !v)}
          />
        )}
      </div>
    </div>
  );
}

export default FloppyBall;
