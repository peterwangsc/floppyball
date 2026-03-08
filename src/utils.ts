import {
  ASSET_RENDER_SIZE,
  BACKGROUND_SPEED,
  BG_HEIGHT,
  BG_WIDTH,
  GAME_HEIGHT,
  GAME_WIDTH,
  GRAVITY,
  MIN_FLAG_Y,
  MIN_PIPE_HEIGHT,
  PIPE_GAP,
  PIPE_SPAWN_RATE,
  PIPE_SPEED,
  PIPE_WIDTH,
} from "./constants";

export const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));

export type GameState = "start" | "playing" | "gameover";

export type Bird = {
  x: number;
  y: number;
  velocity: number;
  width: number;
  height: number;
};

export type Pipe = {
  x: number;
  topHeight: number;
  bottomY: number;
  passed: boolean;
};

export const createBird = (): Bird => ({
  x: 50,
  y: GAME_HEIGHT / 2,
  velocity: 0,
  width: 32,
  height: 32,
});

export const createInitialGameValues = () => ({
  bird: createBird(),
  pipes: [] as Pipe[],
  bgX: 0,
  pipeSpawnTimer: 0,
  lastTime: null as number | null,
  gameOver: false,
});

export const getScaledBackgroundWidth = () =>
  BG_WIDTH * (GAME_HEIGHT / BG_HEIGHT);

export const getDeltaTimeMultiplier = (
  time: number,
  lastTime: number | null,
) => {
  if (lastTime === null) {
    return 0;
  }

  const dt = time - lastTime;
  const cappedDt = Math.min(dt, 50);
  return cappedDt / 16.666;
};

export const updateBird = (bird: Bird, deltaTimeMultiplier: number): Bird => ({
  ...bird,
  velocity: bird.velocity + GRAVITY * deltaTimeMultiplier,
  y:
    bird.y +
    (bird.velocity + GRAVITY * deltaTimeMultiplier) * deltaTimeMultiplier,
});

export const updateBackgroundX = (bgX: number, deltaTimeMultiplier: number) => {
  const scaledBGWidth = getScaledBackgroundWidth();
  const nextBgX = bgX - BACKGROUND_SPEED * deltaTimeMultiplier;
  return nextBgX <= -scaledBGWidth ? nextBgX + scaledBGWidth : nextBgX;
};

export const movePipes = (pipes: Pipe[], deltaTimeMultiplier: number) =>
  pipes.map((pipe) => ({
    ...pipe,
    x: pipe.x - PIPE_SPEED * deltaTimeMultiplier,
  }));

export const getNextPipeSpawn = (
  pipeSpawnTimer: number,
  deltaTimeMultiplier: number,
  randomValue: number,
) => {
  const nextTimer = pipeSpawnTimer + deltaTimeMultiplier;

  if (nextTimer < PIPE_SPAWN_RATE) {
    return {
      pipeSpawnTimer: nextTimer,
      pipe: null as Pipe | null,
    };
  }

  const calculatedMinTop = Math.max(MIN_PIPE_HEIGHT, MIN_FLAG_Y - PIPE_GAP);
  const maxPipeHeight = GAME_HEIGHT - PIPE_GAP - MIN_PIPE_HEIGHT;
  const topHeight =
    randomValue * (maxPipeHeight - calculatedMinTop) + calculatedMinTop;

  return {
    pipeSpawnTimer: nextTimer - PIPE_SPAWN_RATE,
    pipe: {
      x: GAME_WIDTH,
      topHeight,
      bottomY: topHeight + PIPE_GAP,
      passed: false,
    },
  };
};

export const prunePipes = (pipes: Pipe[]) =>
  pipes.length > 0 && pipes[0].x < -300 ? pipes.slice(1) : pipes;

export const updatePassedPipes = (pipes: Pipe[], birdX: number) => {
  let scoreDelta = 0;

  const nextPipes = pipes.map((pipe) => {
    if (!pipe.passed && birdX > pipe.x + PIPE_WIDTH / 2) {
      scoreDelta += 1;
      return {
        ...pipe,
        passed: true,
      };
    }

    return pipe;
  });

  return {
    pipes: nextPipes,
    scoreDelta,
  };
};

export const hasBoundsCollision = (bird: Bird) =>
  bird.y + bird.height >= GAME_HEIGHT || bird.y <= -20;

export const hasPipeCollision = (bird: Bird, pipes: Pipe[]) => {
  const hitboxWidth = 20;
  const hitboxXOffset = (PIPE_WIDTH - hitboxWidth) / 2;

  return pipes.some(
    (pipe) =>
      bird.x + 8 < pipe.x + hitboxXOffset + hitboxWidth &&
      bird.x + bird.width - 8 > pipe.x + hitboxXOffset &&
      (bird.y + 8 < pipe.topHeight || bird.y + bird.height - 8 > pipe.bottomY),
  );
};

export const getBirdRotation = (velocity: number) =>
  Math.min(Math.PI / 4, Math.max(-Math.PI / 4, velocity * 0.1));

export const getAssetRenderX = (pipeX: number) =>
  pipeX + PIPE_WIDTH / 2 - ASSET_RENDER_SIZE / 2;

export const getRenderedImageHeight = (image: HTMLImageElement) =>
  image.width > 0 ? (ASSET_RENDER_SIZE * image.height) / image.width : 0;
