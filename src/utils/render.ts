import { ASSET_RENDER_SIZE, BG_HEIGHT, BG_WIDTH, GAME_HEIGHT, PIPE_WIDTH } from "@/constants";

export const getScaledBackgroundWidth = () => BG_WIDTH * (GAME_HEIGHT / BG_HEIGHT);

export const getAssetRenderX = (pipeX: number) =>
  pipeX + PIPE_WIDTH / 2 - ASSET_RENDER_SIZE / 2;

export const getRenderedImageHeight = (image: HTMLImageElement) =>
  image.width > 0 ? (ASSET_RENDER_SIZE * image.height) / image.width : 0;
