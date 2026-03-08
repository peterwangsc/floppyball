import { memo, type RefObject } from "react";
import birdImageSrc from "@/assets/floppy_ball.png";
import pipeBottomImageSrc from "@/assets/flag_stick_long.png";
import splashImageSrc from "@/assets/golf_background.png";
import bgImageSrc from "@/assets/golf_background_tile.png";
import gameoverImageSrc from "@/assets/golf_background_wide.png";
import pipeTopImageSrc from "@/assets/tree_branch_long.png";

type AssetPreloadsProps = {
  bgImgRef: RefObject<HTMLImageElement | null>;
  birdImgRef: RefObject<HTMLImageElement | null>;
  pipeTopImgRef: RefObject<HTMLImageElement | null>;
  pipeBottomImgRef: RefObject<HTMLImageElement | null>;
};

function AssetPreloadsComponent({
  bgImgRef,
  birdImgRef,
  pipeTopImgRef,
  pipeBottomImgRef,
}: AssetPreloadsProps) {
  return (
    <>
      <img ref={bgImgRef} src={bgImageSrc} className="hidden" alt="bg" />
      <img
        ref={birdImgRef}
        src={birdImageSrc}
        className="hidden"
        alt="bird"
      />
      <img
        ref={pipeTopImgRef}
        src={pipeTopImageSrc}
        className="hidden"
        alt="pipe top"
      />
      <img
        ref={pipeBottomImgRef}
        src={pipeBottomImageSrc}
        className="hidden"
        alt="pipe bottom"
      />
      {[splashImageSrc, gameoverImageSrc].map((src, index) => (
        <img
          key={src}
          src={src}
          className="hidden"
          alt={`overlay preload ${index + 1}`}
        />
      ))}
    </>
  );
}

export const AssetPreloads = memo(AssetPreloadsComponent);
