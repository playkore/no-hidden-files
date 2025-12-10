import { useCallback, useEffect, useState } from "react";
import type {
  MouseEvent as ReactMouseEvent,
  TouchEvent as ReactTouchEvent,
} from "react";
import styles from "./QbertGame.module.css";

type InputAction = "ul" | "ur" | "dl" | "dr";

interface QbertGameProps {
  onClose?: () => void;
}

interface GameInstance {
  handleInput: (action: InputAction) => void;
  resetGame: () => void;
  destroy: () => void;
}

interface GameConfig {
  canvas: HTMLCanvasElement;
  onScoreChange: (score: number) => void;
  onGameOver: (message: string) => void;
  onReset: () => void;
}

export function QbertGame({ onClose }: QbertGameProps) {
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameOverMessage, setGameOverMessage] = useState("");
  const [canvasElement, setCanvasElement] = useState<HTMLCanvasElement | null>(null);
  const [gameInstance, setGameInstance] = useState<GameInstance | null>(null);

  useEffect(() => {
    if (!canvasElement) {
      return;
    }

    const instance = createQbertGame({
      canvas: canvasElement,
      onScoreChange: setScore,
      onGameOver: (message) => {
        setGameOverMessage(message);
        setIsGameOver(true);
      },
      onReset: () => {
        setIsGameOver(false);
        setGameOverMessage("");
      },
    });

    setGameInstance(instance);

    return () => {
      setGameInstance(null);
      instance.destroy();
    };
  }, [canvasElement]);

  const handleCanvasRef = useCallback((node: HTMLCanvasElement | null) => {
    setCanvasElement(node);
  }, []);

  const handlePress =
    (action: InputAction) =>
    (
      event:
        | ReactMouseEvent<HTMLButtonElement>
        | ReactTouchEvent<HTMLButtonElement>
    ) => {
      event.preventDefault();
      gameInstance?.handleInput(action);
    };

  return (
    <div className={styles.wrapper}>
      {onClose && (
        <button
          type="button"
          aria-label="Close game"
          className={styles.closeButton}
          onClick={() => {
            onClose();
          }}
        >
          ✕
        </button>
      )}
      <div className={styles.uiLayer}>
        <div>SCORE: {score}</div>
        <div>LVL: 1</div>
      </div>
      <canvas ref={handleCanvasRef} className={styles.canvas} />
      <div className={styles.controls}>
        <button
          type="button"
          className={`${styles.dPadBtn} ${styles.btnUL}`}
          onMouseDown={handlePress("ul")}
          onTouchStart={handlePress("ul")}
        >
          ↖
        </button>
        <button
          type="button"
          className={`${styles.dPadBtn} ${styles.btnUR}`}
          onMouseDown={handlePress("ur")}
          onTouchStart={handlePress("ur")}
        >
          ↖
        </button>
        <button
          type="button"
          className={`${styles.dPadBtn} ${styles.btnDL}`}
          onMouseDown={handlePress("dl")}
          onTouchStart={handlePress("dl")}
        >
          ↙
        </button>
        <button
          type="button"
          className={`${styles.dPadBtn} ${styles.btnDR}`}
          onMouseDown={handlePress("dr")}
          onTouchStart={handlePress("dr")}
        >
          ↙
        </button>
      </div>
      <div className={styles.gameOver} style={{ display: isGameOver ? "block" : "none" }}>
        <h1>GAME OVER</h1>
        <p>{gameOverMessage}</p>
        <button
          type="button"
          className={styles.restartBtn}
          onClick={() => gameInstance?.resetGame()}
        >
          RETRY
        </button>
      </div>
    </div>
  );
}

function createQbertGame({
  canvas,
  onScoreChange,
  onGameOver,
  onReset,
}: GameConfig): GameInstance {
  const renderingContext = canvas.getContext("2d");
  if (!renderingContext) {
    return {
      handleInput: () => undefined,
      resetGame: () => undefined,
      destroy: () => undefined,
    };
  }
  const ctx: CanvasRenderingContext2D = renderingContext;

  const PALETTE = {
    black: "#000000",
    green: "#55FF55",
    magenta: "#FF55FF",
    yellow: "#FFFF55",
  } as const;

  const ROWS = 7;
  let tileWidth = 50;
  let tileHeight = 40;

  type Tile = { active: boolean; r: number; c: number };
  interface Enemy {
    r: number;
    c: number;
    x: number;
    y: number;
    isJumping: boolean;
    jumpProgress: number;
    targetX: number;
    targetY: number;
    origX: number;
    origY: number;
    waitTimer: number;
  }

  interface Player {
    r: number;
    c: number;
    x: number;
    y: number;
    targetX: number;
    targetY: number;
    isJumping: boolean;
    jumpProgress: number;
    dead: boolean;
    dieOnLand: boolean;
    origX: number;
    origY: number;
  }

  let animationFrame = 0;
  let lastTime = 0;
  let score = 0;
  let isGameOver = false;
  let enemySpawnTimer = 0;
  let map: Tile[][] = [];
  let enemies: Enemy[] = [];

  const player: Player = {
    r: 0,
    c: 0,
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    isJumping: false,
    jumpProgress: 0,
    dead: false,
    dieOnLand: false,
    origX: 0,
    origY: 0,
  };

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    tileWidth = Math.floor(Math.min(60, canvas.width / (ROWS + 1)));
    tileHeight = tileWidth * 0.7;
  }

  function gridToScreen(r: number, c: number) {
    const centerX = canvas.width / 2;
    const startY = canvas.height * 0.15;
    const x = centerX + c * tileWidth - (r * tileWidth) / 2;
    const y = startY + r * tileHeight;
    return { x, y };
  }

  function initMap() {
    map = [];
    score = 0;
    enemies = [];
    enemySpawnTimer = 0;
    isGameOver = false;
    player.dead = false;
    player.dieOnLand = false;
    onReset();
    onScoreChange(score);

    for (let r = 0; r < ROWS; r += 1) {
      const row: Tile[] = [];
      for (let c = 0; c <= r; c += 1) {
        row.push({ active: false, r, c });
      }
      map.push(row);
    }

    player.r = 0;
    player.c = 0;
    player.isJumping = false;
    const pos = gridToScreen(0, 0);
    player.x = pos.x;
    player.y = pos.y;
    player.targetX = pos.x;
    player.targetY = pos.y;
  }

  function drawIsoPoly(x: number, y: number, hw: number, hh: number, type: "top" | "right" | "left") {
    ctx.beginPath();
    if (type === "top") {
      ctx.moveTo(x, y - hh);
      ctx.lineTo(x + hw, y);
      ctx.lineTo(x, y + hh);
      ctx.lineTo(x - hw, y);
    } else if (type === "right") {
      ctx.moveTo(x + hw, y);
      ctx.lineTo(x + hw, y + hh * 2);
      ctx.lineTo(x, y + hh * 3);
      ctx.lineTo(x, y + hh);
    } else {
      ctx.moveTo(x - hw, y);
      ctx.lineTo(x - hw, y + hh * 2);
      ctx.lineTo(x, y + hh * 3);
      ctx.lineTo(x, y + hh);
    }
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(0,0,0,0.5)";
    ctx.stroke();
  }

  function drawCube(r: number, c: number, active: boolean) {
    const pos = gridToScreen(r, c);
    const hw = tileWidth / 2;
    const hh = tileHeight / 2;

    ctx.fillStyle = active ? PALETTE.yellow : PALETTE.green;
    drawIsoPoly(pos.x, pos.y, hw, hh, "top");

    ctx.fillStyle = active ? PALETTE.yellow : PALETTE.green;
    drawIsoPoly(pos.x, pos.y, hw, hh, "right");

    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    drawIsoPoly(pos.x, pos.y, hw, hh, "right");

    ctx.fillStyle = active ? PALETTE.yellow : PALETTE.green;
    drawIsoPoly(pos.x, pos.y, hw, hh, "left");

    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    drawIsoPoly(pos.x, pos.y, hw, hh, "left");
  }

  function drawPlayer() {
    if (player.dead) return;

    let drawY = player.y;
    if (player.isJumping) {
      const heightOffset = Math.sin(player.jumpProgress * Math.PI) * (tileHeight * 1.5);
      drawY -= heightOffset;
    }

    ctx.beginPath();
    ctx.ellipse(
      player.x,
      player.y + tileHeight / 2,
      tileWidth / 3,
      tileHeight / 5,
      0,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fill();

    const radius = tileWidth / 2.5;
    ctx.beginPath();
    ctx.arc(player.x, drawY - 10, radius, 0, Math.PI * 2);
    ctx.fillStyle = PALETTE.magenta;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = PALETTE.black;
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(player.x + radius / 1.5, drawY - 5, radius / 2, radius / 2.5, 0.5, 0, Math.PI * 2);
    ctx.fillStyle = PALETTE.yellow;
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = PALETTE.black;
    ctx.beginPath();
    ctx.arc(player.x - 5, drawY - 20, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(player.x + 8, drawY - 22, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawEnemies() {
    for (const enemy of enemies) {
      let drawY = enemy.y;
      if (enemy.isJumping) {
        drawY -= Math.sin(enemy.jumpProgress * Math.PI) * (tileHeight * 1.2);
      }

      ctx.beginPath();
      ctx.ellipse(
        enemy.x,
        enemy.y + tileHeight / 2,
        tileWidth / 4,
        tileHeight / 6,
        0,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(enemy.x, drawY - 10, tileWidth / 3, 0, Math.PI * 2);
      ctx.fillStyle = PALETTE.magenta;
      ctx.fill();

      ctx.lineWidth = 3;
      ctx.strokeStyle = PALETTE.black;
      ctx.stroke();

      ctx.fillStyle = PALETTE.yellow;
      ctx.beginPath();
      ctx.arc(enemy.x - 6, drawY - 12, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(enemy.x + 6, drawY - 12, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = PALETTE.black;
      ctx.fillRect(enemy.x - 7, drawY - 13, 2, 6);
      ctx.fillRect(enemy.x + 5, drawY - 13, 2, 6);
    }
  }

  function checkWin() {
    for (const row of map) {
      for (const tile of row) {
        if (!tile.active) {
          return;
        }
      }
    }
    gameOver("VICTORY!");
  }

  function movePlayer(dr: number, dc: number) {
    if (player.isJumping || player.dead || isGameOver) return;

    const nextR = player.r + dr;
    const nextC = player.c + dc;
    const validMove = nextR >= 0 && nextR < ROWS && nextC >= 0 && nextC <= nextR;

    player.isJumping = true;
    player.jumpProgress = 0;

    const destPos = gridToScreen(nextR, nextC);

    player.origX = player.x;
    player.origY = player.y;
    player.targetX = destPos.x;
    player.targetY = destPos.y;
    player.r = nextR;
    player.c = nextC;

    player.dieOnLand = !validMove;
  }

  function update(dt: number) {
    if (isGameOver) return;

    if (player.isJumping) {
      player.jumpProgress += dt * 3.5;
      if (player.jumpProgress >= 1) {
        player.jumpProgress = 1;
        player.isJumping = false;
        player.x = player.targetX;
        player.y = player.targetY;

        if (player.dieOnLand) {
          gameOver("YOU FELL!");
          return;
        }

        const tile = map[player.r]?.[player.c];
        if (tile && !tile.active) {
          tile.active = true;
          score += 25;
          onScoreChange(score);
          checkWin();
        }
      } else {
        player.x = player.origX + (player.targetX - player.origX) * player.jumpProgress;
        player.y = player.origY + (player.targetY - player.origY) * player.jumpProgress;
      }
    }

    enemySpawnTimer += dt;
    if (enemySpawnTimer > 2.5 && enemies.length < 3) {
      enemySpawnTimer = 0;
      const origin = gridToScreen(0, 0);
      enemies.push({
        r: 0,
        c: 0,
        x: origin.x,
        y: origin.y,
        isJumping: false,
        jumpProgress: 0,
        targetX: origin.x,
        targetY: origin.y,
        origX: origin.x,
        origY: origin.y,
        waitTimer: 0,
      });
    }

    for (let i = enemies.length - 1; i >= 0; i -= 1) {
      const enemy = enemies[i];
      if (!enemy) {
        continue;
      }
      if (enemy.isJumping) {
        enemy.jumpProgress += dt * 1.8;
        if (enemy.jumpProgress >= 1) {
          enemy.isJumping = false;
          enemy.x = enemy.targetX;
          enemy.y = enemy.targetY;
          if (enemy.r >= ROWS) {
            enemies.splice(i, 1);
            continue;
          }
        } else {
          enemy.x = enemy.origX + (enemy.targetX - enemy.origX) * enemy.jumpProgress;
          enemy.y = enemy.origY + (enemy.targetY - enemy.origY) * enemy.jumpProgress;
        }
      } else {
        enemy.waitTimer += dt;
        if (enemy.waitTimer > 0.8) {
          enemy.waitTimer = 0;
          const dir = Math.random() > 0.5 ? 0 : 1;
          const nextR = enemy.r + 1;
          const nextC = dir === 0 ? enemy.c : enemy.c + 1;

          enemy.isJumping = true;
          enemy.jumpProgress = 0;
          enemy.origX = enemy.x;
          enemy.origY = enemy.y;
          enemy.r = nextR;
          enemy.c = nextC;

          const dest = gridToScreen(nextR, nextC);
          enemy.targetX = dest.x;
          enemy.targetY = dest.y;
        }
      }

      const dx = player.x - enemy.x;
      const dy = player.y - enemy.y;
      if (Math.sqrt(dx * dx + dy * dy) < tileWidth / 1.5 && !player.dead) {
        gameOver("CAUGHT!");
      }
    }
  }

  function draw() {
    ctx.fillStyle = PALETTE.black;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (const row of map) {
      for (const tile of row) {
        drawCube(tile.r, tile.c, tile.active);
      }
    }

    drawEnemies();
    drawPlayer();
  }

  function loop(timestamp: number) {
    const dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;
    update(dt);
    draw();
    animationFrame = window.requestAnimationFrame(loop);
  }

  function gameOver(message: string) {
    isGameOver = true;
    player.dead = true;
    onGameOver(message);
  }

  function resetGame() {
    player.dieOnLand = false;
    initMap();
  }

  function handleInput(action: InputAction) {
    if (isGameOver) return;
    switch (action) {
      case "ul":
        movePlayer(-1, -1);
        break;
      case "ur":
        movePlayer(-1, 0);
        break;
      case "dl":
        movePlayer(1, 0);
        break;
      case "dr":
        movePlayer(1, 1);
        break;
    }
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (isGameOver && event.key === "Enter") {
      resetGame();
      return;
    }
    switch (event.key) {
      case "ArrowUp":
        handleInput("ur");
        break;
      case "ArrowLeft":
        handleInput("ul");
        break;
      case "ArrowDown":
        handleInput("dl");
        break;
      case "ArrowRight":
        handleInput("dr");
        break;
      case "q":
      case "Q":
      case "7":
        handleInput("ul");
        break;
      case "w":
      case "W":
      case "9":
        handleInput("ur");
        break;
      case "a":
      case "A":
      case "1":
        handleInput("dl");
        break;
      case "s":
      case "S":
      case "3":
        handleInput("dr");
        break;
      default:
        break;
    }
  };

  const handleResize = () => {
    resize();
    draw();
  };

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("resize", handleResize);

  resize();
  initMap();
  animationFrame = window.requestAnimationFrame(loop);

  return {
    handleInput,
    resetGame,
    destroy: () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    },
  };
}
