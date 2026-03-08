import type { RefObject } from "react";
import {
  ASSET_RENDER_SIZE,
  BIRD_RENDER_SIZE,
  GAME_HEIGHT,
  GAME_WIDTH,
  JUMP_STRENGTH,
  RESTART_COOLDOWN_MS,
} from "./constants";
import {
  createInitialGameValues,
  getAssetRenderX,
  getBirdRotation,
  getDeltaTimeMultiplier,
  getNextPipeSpawn,
  getRenderedImageHeight,
  getScaledBackgroundWidth,
  hasBoundsCollision,
  hasPipeCollision,
  prunePipes,
  type GameState,
  type Pipe,
  updateBackgroundX,
  updateBird,
  updatePassedPipes,
  movePipes,
} from "./utils/index";

type GameImageRefs = {
  bgImgRef: RefObject<HTMLImageElement | null>;
  birdImgRef: RefObject<HTMLImageElement | null>;
  pipeTopImgRef: RefObject<HTMLImageElement | null>;
  pipeBottomImgRef: RefObject<HTMLImageElement | null>;
};

type GameCallbacks = {
  submitScore?: (name: string, score: number) => Promise<boolean> | void;
  onGameStateChange?: (gameState: GameState, score?: number) => void;
};

type GameOptions = GameImageRefs &
  GameCallbacks & {
    canvasRef: RefObject<HTMLCanvasElement | null>;
  };

export class Game {
  private canvasRef: RefObject<HTMLCanvasElement | null>;
  private bgImgRef: RefObject<HTMLImageElement | null>;
  private birdImgRef: RefObject<HTMLImageElement | null>;
  private pipeTopImgRef: RefObject<HTMLImageElement | null>;
  private pipeBottomImgRef: RefObject<HTMLImageElement | null>;
  private submitScore?: (name: string, score: number) => Promise<boolean> | void;
  private onGameStateChange?: (gameState: GameState, score?: number) => void;
  private requestId: number | null = null;
  private isMounted = false;
  private gameState: GameState = "start";
  private gameEndedAt: number | null = null;
  private username = "";
  private score = 0;
  private bird = createInitialGameValues().bird;
  private pipes: Pipe[] = createInitialGameValues().pipes;
  private bgX = createInitialGameValues().bgX;
  private pipeSpawnTimer = createInitialGameValues().pipeSpawnTimer;
  private lastTime = createInitialGameValues().lastTime;
  private gameOver = createInitialGameValues().gameOver;

  constructor({
    canvasRef,
    bgImgRef,
    birdImgRef,
    pipeTopImgRef,
    pipeBottomImgRef,
    submitScore,
    onGameStateChange,
  }: GameOptions) {
    this.canvasRef = canvasRef;
    this.bgImgRef = bgImgRef;
    this.birdImgRef = birdImgRef;
    this.pipeTopImgRef = pipeTopImgRef;
    this.pipeBottomImgRef = pipeBottomImgRef;
    this.submitScore = submitScore;
    this.onGameStateChange = onGameStateChange;
  }

  public setUsername = (username: string) => {
    if (this.username === username) {
      return;
    }

    this.username = username;
  };

  public start() {
    if (!this.username.trim()) {
      return;
    }

    this.resetGameValues();
    this.gameState = "playing";
    this.score = 0;
    this.onGameStateChange?.(this.gameState, 0);
  }

  public jump() {
    if (this.gameState === "playing") {
      this.bird.velocity = JUMP_STRENGTH;
      return;
    }

    if (
      this.gameEndedAt !== null &&
      Date.now() - this.gameEndedAt < RESTART_COOLDOWN_MS
    ) {
      return;
    }

    this.start();
  }

  public update(deltaTimeMultiplier: number) {
    if (this.gameState !== "playing") {
      return;
    }

    this.bird = updateBird(this.bird, deltaTimeMultiplier);
    this.bgX = updateBackgroundX(this.bgX, deltaTimeMultiplier);
    this.pipes = movePipes(this.pipes, deltaTimeMultiplier);

    const nextPipeSpawn = getNextPipeSpawn(
      this.pipeSpawnTimer,
      deltaTimeMultiplier,
      Math.random(),
    );
    this.pipeSpawnTimer = nextPipeSpawn.pipeSpawnTimer;
    if (nextPipeSpawn.pipe) {
      this.pipes = [...this.pipes, nextPipeSpawn.pipe];
    }

    this.pipes = prunePipes(this.pipes);

    const passedPipeUpdate = updatePassedPipes(this.pipes, this.bird.x);
    this.pipes = passedPipeUpdate.pipes;
    if (passedPipeUpdate.scoreDelta > 0) {
      this.score += passedPipeUpdate.scoreDelta;
    }

    if (
      hasBoundsCollision(this.bird) ||
      hasPipeCollision(this.bird, this.pipes)
    ) {
      this.endGame();
    }
  }

  public render() {
    const canvas = this.canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) {
      return;
    }

    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    const scaledBGWidth = getScaledBackgroundWidth();
    if (this.bgImgRef.current && this.bgImgRef.current.complete) {
      const xPos = this.bgX % scaledBGWidth;
      ctx.drawImage(this.bgImgRef.current, xPos, 0, scaledBGWidth, GAME_HEIGHT);
      ctx.drawImage(
        this.bgImgRef.current,
        xPos + scaledBGWidth,
        0,
        scaledBGWidth,
        GAME_HEIGHT,
      );
    } else {
      ctx.fillStyle = "#87CEEB";
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    }

    this.renderPipes(ctx);
    this.renderBird(ctx);
    this.renderScore(ctx);
  }

  public loop = (time: number) => {
    const deltaTimeMultiplier = getDeltaTimeMultiplier(time, this.lastTime);
    if (deltaTimeMultiplier > 0) {
      this.update(deltaTimeMultiplier);
    }

    this.lastTime = time;
    this.render();
    this.requestId = requestAnimationFrame(this.loop);
  };

  public mount() {
    if (this.isMounted) {
      return;
    }

    this.isMounted = true;
    document.addEventListener("keydown", this.handleKeyDown);
    this.requestId = requestAnimationFrame(this.loop);
  }

  public destroy() {
    if (!this.isMounted) {
      return;
    }

    this.isMounted = false;
    if (this.requestId !== null) {
      cancelAnimationFrame(this.requestId);
      this.requestId = null;
    }

    document.removeEventListener("keydown", this.handleKeyDown);
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === "Space") {
      e.preventDefault();
      this.jump();
    }
  };

  private resetGameValues() {
    const initialValues = createInitialGameValues();
    this.bird = initialValues.bird;
    this.pipes = initialValues.pipes;
    this.bgX = initialValues.bgX;
    this.pipeSpawnTimer = initialValues.pipeSpawnTimer;
    this.lastTime = initialValues.lastTime;
    this.gameOver = initialValues.gameOver;
  }

  private endGame() {
    if (this.gameOver) {
      return;
    }

    this.gameOver = true;
    this.gameState = "gameover";
    this.gameEndedAt = Date.now();
    this.onGameStateChange?.(this.gameState, this.score);
    if (this.score > 0) {
      void this.submitScore?.(this.username, this.score);
    }
  }

  private renderPipes(ctx: CanvasRenderingContext2D) {
    if (
      !this.pipeTopImgRef.current ||
      !this.pipeBottomImgRef.current ||
      !this.pipeTopImgRef.current.complete ||
      !this.pipeBottomImgRef.current.complete
    ) {
      return;
    }

    this.pipes.forEach((pipe) => {
      const renderX = getAssetRenderX(pipe.x);
      const topPipeHeight = getRenderedImageHeight(this.pipeTopImgRef.current!);
      const bottomPipeHeight = getRenderedImageHeight(
        this.pipeBottomImgRef.current!,
      );

      if (topPipeHeight > 0) {
        ctx.drawImage(
          this.pipeTopImgRef.current!,
          renderX,
          pipe.topHeight - topPipeHeight,
          ASSET_RENDER_SIZE,
          topPipeHeight,
        );
      }

      if (bottomPipeHeight > 0) {
        ctx.drawImage(
          this.pipeBottomImgRef.current!,
          renderX,
          pipe.bottomY,
          ASSET_RENDER_SIZE,
          bottomPipeHeight,
        );
      }
    });
  }

  private renderBird(ctx: CanvasRenderingContext2D) {
    if (this.birdImgRef.current && this.birdImgRef.current.complete) {
      ctx.save();
      ctx.translate(this.bird.x + 16, this.bird.y + 16);
      ctx.rotate(getBirdRotation(this.bird.velocity));
      ctx.drawImage(
        this.birdImgRef.current,
        -BIRD_RENDER_SIZE / 2,
        -BIRD_RENDER_SIZE / 2,
        BIRD_RENDER_SIZE,
        BIRD_RENDER_SIZE,
      );
      ctx.restore();
      return;
    }

    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(this.bird.x + 16, this.bird.y + 16, 16, 0, Math.PI * 2);
    ctx.fill();
  }

  private renderScore(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.font = "bold 32px Arial";
    ctx.textAlign = "center";
    ctx.fillText(this.score.toString(), GAME_WIDTH / 2, 50);
    ctx.strokeText(this.score.toString(), GAME_WIDTH / 2, 50);
  }
}
