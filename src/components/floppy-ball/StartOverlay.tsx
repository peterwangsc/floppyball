import { useState } from "react";
import { OutlinedText } from "./OutlinedText";
import splashImageSrc from "@/assets/golf_background.png";
import birdImageSrc from "@/assets/floppy_ball.png";

type StartOverlayProps = {
  onStart: (username: string) => void;
};

export function StartOverlay({ onStart }: StartOverlayProps) {
  const [username, setUsername] = useState("");
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center overflow-hidden rounded-[24px] p-[22px]">
      <img
        src={splashImageSrc}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 size-full object-cover"
      />

      <div className="relative z-10 flex min-h-[300px] w-full flex-col items-center justify-center">
        <img
          src={birdImageSrc}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute top-[70px] left-1/2 w-[120px] -translate-x-1/2 object-contain"
        />
        <OutlinedText
          as="h1"
          className="m-0 whitespace-nowrap text-4xl font-bold tracking-[0.2em] text-white"
        >
          FLOPPY BALL
        </OutlinedText>

        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          maxLength={18}
          placeholder="Enter username"
          className="mt-[140px] w-[min(280px,80%)] rounded-2xl border-2 border-black bg-white px-4 py-3 text-center text-base outline-none"
        />
      </div>

      <button
        className="relative z-10 w-auto rounded-[24px] border-4 border-black bg-linear-to-b from-[#2fa54d] to-[#1a6f33] px-8 py-4 text-white disabled:cursor-not-allowed disabled:opacity-60"
        disabled={!username.trim()}
        onClick={(e) => {
          e.stopPropagation();
          onStart(username);
        }}
      >
        <OutlinedText className="whitespace-nowrap text-[2rem] font-bold tracking-[0.15em] text-white">
          HIT A FLOP
        </OutlinedText>
      </button>
    </div>
  );
}
