import { useState } from "react";
import { cn } from "@/utils";
import { OutlinedText } from "./OutlinedText";
import splashImageSrc from "@/assets/golf_background.png";
import birdImageSrc from "@/assets/floppy_ball.png";

type StartOverlayProps = {
  onStart: (username: string) => void;
};

export function StartOverlay({ onStart }: StartOverlayProps) {
  const [username, setUsername] = useState("");
  const [isExiting, setIsExiting] = useState(false);
  const [attempted, setAttempted] = useState(false);

  const handleStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isExiting) return;
    if (!username.trim()) {
      setAttempted(false);
      requestAnimationFrame(() => setAttempted(true));
      return;
    }
    setIsExiting(true);
    setTimeout(() => onStart(username), 300);
  };

  return (
    <div
      className={cn(
        "absolute inset-0 z-20 flex flex-col items-center justify-center overflow-hidden rounded-overlay p-5.5",
        isExiting && "animate-overlay-exit pointer-events-none",
      )}
    >
      <img
        src={splashImageSrc}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

      <div className="relative z-10 flex min-h-75 w-full flex-col items-center justify-center">
        <div
          className="pointer-events-none absolute animate-float drop-shadow-ball"
          style={{ top: "70px", left: "calc(50% - 60px)", width: "120px" }}
        >
          <img
            src={birdImageSrc}
            alt=""
            aria-hidden="true"
            className="w-full object-contain"
          />
        </div>

        <OutlinedText
          as="h1"
          className="font-display animate-fade-in-up m-0 whitespace-nowrap text-4xl tracking-2xl text-white"
          style={{ animationDelay: "0.05s" }}
        >
          FLOPPY BALL
        </OutlinedText>

        <div className="animate-fade-in-up mt-35 w-input-max" style={{ animationDelay: "0.18s" }}>
          <input
            value={username}
            onChange={(e) => { setUsername(e.target.value); setAttempted(false); }}
            maxLength={18}
            placeholder="enter username"
            className={cn(
              "font-mono w-full rounded-xl border-2 bg-scorecard/95 px-4 py-3 text-center text-base text-rough outline-none placeholder:text-sand-light focus:ring-2 transition-colors duration-300",
              attempted
                ? "border-bogey focus:border-bogey focus:ring-bogey/30 animate-input-nudge"
                : "border-flag focus:border-turf focus:ring-turf/30",
            )}
          />
        </div>
      </div>

      <button
        className="animate-fade-in-up relative z-10 w-auto rounded-2xl border-3 border-flag bg-linear-to-b from-btn-green to-btn-dark px-8 py-3.5 shadow-btn active:translate-y-1 active:shadow-btn-active-sm transition-transform disabled:cursor-not-allowed disabled:opacity-50"
        style={{ animationDelay: "0.32s" }}
        onClick={handleStart}
      >
        <OutlinedText className="font-display whitespace-nowrap text-display-lg tracking-xl text-white">
          HIT A FLOP
        </OutlinedText>
      </button>
    </div>
  );
}
