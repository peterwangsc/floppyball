import { useCallback, useEffect, useRef, useState } from "react";
import { Game } from "@/Game";
import { useSupabase } from "@/hooks/useSupabase";
import { AssetPreloads } from "@/components/floppy-ball/AssetPreloads";
import { GameCanvas } from "@/components/floppy-ball/GameCanvas";
import { GameOverOverlay } from "@/components/floppy-ball/GameOverOverlay";
import { LeaderboardTable } from "@/components/floppy-ball/LeaderboardTable";
import { StartOverlay } from "@/components/floppy-ball/StartOverlay";
import type { GameState } from "@/utils";

export function FloppyBall() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgImgRef = useRef<HTMLImageElement>(null);
  const birdImgRef = useRef<HTMLImageElement>(null);
  const pipeTopImgRef = useRef<HTMLImageElement>(null);
  const pipeBottomImgRef = useRef<HTMLImageElement>(null);
  const [gameState, setGameState] = useState<GameState>("start");
  const [finalScore, setFinalScore] = useState(0);
  const { submitScore } = useSupabase();
  const [game] = useState(
    () =>
      new Game({
        canvasRef,
        bgImgRef,
        birdImgRef,
        pipeTopImgRef,
        pipeBottomImgRef,
        submitScore,
        onGameStateChange: (nextGameState, score) => {
          setGameState(nextGameState);
          if (typeof score === "number") {
            setFinalScore(score);
          }
        },
      }),
  );

  const handleJump = useCallback(() => {
    game.jump();
  }, [game]);

  const handleStart = useCallback(
    (username: string) => {
      game.setUsername(username);
      game.jump();
    },
    [game],
  );

  useEffect(() => {
    game.render();
    game.mount();

    return () => {
      game.destroy();
    };
  }, [game]);

  return (
    <div className="mx-auto w-full max-w-[400px] px-2.5 pt-5 pb-10 sm:px-4 sm:pt-8">
      <AssetPreloads
        bgImgRef={bgImgRef}
        birdImgRef={birdImgRef}
        pipeTopImgRef={pipeTopImgRef}
        pipeBottomImgRef={pipeBottomImgRef}
      />

      <div className="mx-auto w-full max-w-[400px]">
        <div className="relative aspect-2/3 w-full max-w-[400px]">
          <GameCanvas canvasRef={canvasRef} onJump={handleJump} />

          {gameState === "start" && <StartOverlay onStart={handleStart} />}

          {gameState === "gameover" && (
            <GameOverOverlay score={finalScore} onRetry={handleJump} />
          )}
        </div>

        <LeaderboardTable />
      </div>
    </div>
  );
}

export default FloppyBall;
