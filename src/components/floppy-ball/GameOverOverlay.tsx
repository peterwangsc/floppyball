import { OutlinedText } from "./OutlinedText";
import gameoverImageSrc from "@/assets/golf_background_wide.png";

type GameOverOverlayProps = {
  score: number;
  onRetry: () => void;
};

export function GameOverOverlay({ score, onRetry }: GameOverOverlayProps) {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 p-[22px]">
      <div className="relative flex min-h-[300px] w-[90%] max-w-[360px] flex-col items-center justify-center overflow-hidden rounded-2xl border-4 border-black bg-black px-4 py-8 shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
        <img
          src={gameoverImageSrc}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover"
        />

        <div className="relative z-20 flex flex-col items-center">
          <OutlinedText
            as="h2"
            className="m-0 mb-2 whitespace-nowrap text-4xl font-bold text-white"
          >
            SCORE: {score}
          </OutlinedText>

          <button
            className="mt-10 cursor-pointer rounded-full border border-white bg-[#2f9347] px-6 py-3"
            onClick={(e) => {
              e.stopPropagation();
              onRetry();
            }}
          >
            <OutlinedText
              className="whitespace-nowrap text-[2rem] font-bold tracking-[0.15em] text-white"
            >
              RETRY
            </OutlinedText>
          </button>
        </div>
      </div>
    </div>
  );
}
