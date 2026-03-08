import { memo, type RefObject } from "react";
import { GAME_WIDTH, GAME_HEIGHT } from "@/lib/constants";

type GameCanvasProps = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  onJump: () => void;
};

function GameCanvasComponent({ canvasRef, onJump }: GameCanvasProps) {
  return (
    <div
      className="absolute inset-0 z-10 overflow-hidden rounded-overlay touch-none select-none"
      onPointerDown={onJump}
      onContextMenu={(e) => e.preventDefault()}
    >
      <canvas
        ref={canvasRef}
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
        className="block size-full cursor-pointer touch-none select-none canvas-image-rendering no-touch-callout"
      />
    </div>
  );
}

export const GameCanvas = memo(GameCanvasComponent);
