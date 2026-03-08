import { memo, type RefObject } from "react";
import { GAME_WIDTH, GAME_HEIGHT } from "@/constants";

type GameCanvasProps = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  onJump: () => void;
};

function GameCanvasComponent({ canvasRef, onJump }: GameCanvasProps) {
  return (
    <div
      className="absolute inset-0 z-10 overflow-hidden rounded-[24px] touch-none select-none"
      onPointerDown={onJump}
      onContextMenu={(e) => e.preventDefault()}
    >
      <canvas
        ref={canvasRef}
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
        className="block size-full cursor-pointer touch-none select-none [image-rendering:pixelated] [-webkit-touch-callout:none] [-webkit-user-select:none]"
      />
    </div>
  );
}

export const GameCanvas = memo(GameCanvasComponent);
