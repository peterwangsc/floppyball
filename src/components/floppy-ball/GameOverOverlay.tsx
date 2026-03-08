import { useEffect, useState } from "react";
import { cn } from "@/utils";
import gameoverImageSrc from "@/assets/golf_background_wide.png";

type GameOverOverlayProps = {
  score: number;
  onRetry: () => void;
};

export function GameOverOverlay({ score, onRetry }: GameOverOverlayProps) {
  const [retryReady, setRetryReady] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRetryReady(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const handleRetry = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!retryReady || isExiting) return;
    setIsExiting(true);
    setTimeout(onRetry, 220);
  };

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/55 backdrop-blur-px p-5.5">
      <div
        className={cn(
          "relative flex min-h-70 w-9/10 max-w-80 flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-flag/50 px-6 py-8 shadow-card bg-rough",
          isExiting ? "animate-card-exit" : "animate-card-drop",
        )}
      >
        <img
          src={gameoverImageSrc}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover opacity-15"
        />

        <div className="relative z-20 flex flex-col items-center gap-1">
          <span
            className="font-display animate-fade-in-up text-flag/80 text-xs tracking-4xl uppercase mb-3"
            style={{ animationDelay: "0.1s" }}
          >
            Game Over
          </span>

          <div
            className="font-display text-white tabular-nums leading-none animate-score-pop text-score-fluid"
            style={{ animationDelay: "0.25s" }}
          >
            {score}
          </div>

          <span
            className="font-mono animate-fade-in-up text-flag/50 text-2xs tracking-3xl uppercase mt-1 mb-8"
            style={{ animationDelay: "0.45s" }}
          >
            score
          </span>

          {retryReady && (
            <button
              className="animate-fade-in-up cursor-pointer rounded-xl border-3 border-flag bg-linear-to-b from-btn-green to-btn-dark px-10 py-3 shadow-btn active:translate-y-1 active:shadow-btn-active transition-transform"
              onClick={handleRetry}
            >
              <span className="font-display text-outlined whitespace-nowrap text-display-md tracking-xl text-white">
                RETRY
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
