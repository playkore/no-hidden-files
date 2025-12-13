import { useCallback, useEffect, useRef, useState } from "react";
import type {
  MouseEvent as ReactMouseEvent,
  TouchEvent as ReactTouchEvent,
} from "react";
import styles from "./BombermanGame.module.css";

type GameState = "start" | "playing" | "gameover" | "win";

interface BombermanGameProps {
  onClose?: () => void;
}

interface GameActions {
  startGame: () => void;
  resetGame: () => void;
  placeBomb: () => void;
}

export default function BombermanGame({ onClose }: BombermanGameProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameContainerRef = useRef<HTMLDivElement | null>(null);
  const joystickZoneRef = useRef<HTMLDivElement | null>(null);
  const joystickKnobRef = useRef<HTMLDivElement | null>(null);
  const actionsRef = useRef<GameActions | null>(null);
  const [gameState, setGameState] = useState<GameState>("start");
  const [isBombPressed, setIsBombPressed] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gameContainer = gameContainerRef.current;
    const joystickZone = joystickZoneRef.current;
    const joystickKnob = joystickKnobRef.current;

    if (!canvas || !joystickZone || !joystickKnob || !gameContainer) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const COLS = 15;
    const ROWS = 13;
    const TILE_SIZE = 32;
    const TYPES = { EMPTY: 0, WALL: 1, SOFT: 2 } as const;
    type TileType = (typeof TYPES)[keyof typeof TYPES];

    interface Player {
      x: number;
      y: number;
      radius: number;
      speed: number;
      alive: boolean;
      bombLimit: number;
      bombCount: number;
      power: number;
    }

    interface Enemy {
      x: number;
      y: number;
      dir: number;
      speed: number;
      radius: number;
      alive: boolean;
    }

    interface Bomb {
      c: number;
      r: number;
      timer: number;
      radius: number;
    }

    interface Particle {
      c: number;
      r: number;
      life: number;
    }

    type KeyCode = "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight" | "Space";
    const keys: Record<KeyCode, boolean> = {
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false,
      Space: false,
    };

    const createPlayer = (): Player => ({
      x: TILE_SIZE * 1.5,
      y: TILE_SIZE * 1.5,
      radius: TILE_SIZE * 0.35,
      speed: 0.0035,
      alive: true,
      bombLimit: 1,
      bombCount: 0,
      power: 2,
    });

    let grid: TileType[][] = Array.from({ length: ROWS }, () =>
      Array.from({ length: COLS }, () => TYPES.EMPTY)
    );
    let player: Player = createPlayer();
    let enemies: Enemy[] = [];
    let bombs: Bomb[] = [];
    let particles: Particle[] = [];
    let lastTime = performance.now();
    let animationFrame = 0;
    let currentState: GameState = "start";
    let destroyed = false;

    canvas.width = COLS * TILE_SIZE;
    canvas.height = ROWS * TILE_SIZE;

    const setState = (next: GameState) => {
      if (destroyed) return;
      currentState = next;
      setGameState(next);
    };

    const resizeCanvas = () => {
      const maxWidth = window.innerWidth - 20;
      const maxHeight = window.innerHeight * 0.55;
      const scale = Math.min(
        maxWidth / canvas.width,
        maxHeight / canvas.height
      );
      const safeScale = Number.isFinite(scale) ? scale : 1;
      canvas.style.width = `${canvas.width * safeScale}px`;
      canvas.style.height = `${canvas.height * safeScale}px`;
    };

    const isKeyCode = (code: string): code is KeyCode => code in keys;

    const initGrid = () => {
      const nextGrid: TileType[][] = [];
      for (let r = 0; r < ROWS; r++) {
        const row: TileType[] = [];
        for (let c = 0; c < COLS; c++) {
          if (r === 0 || r === ROWS - 1 || c === 0 || c === COLS - 1) {
            row.push(TYPES.WALL);
          } else if (r % 2 === 0 && c % 2 === 0) {
            row.push(TYPES.WALL);
          } else if (
            (r === 1 && c === 1) ||
            (r === 1 && c === 2) ||
            (r === 2 && c === 1)
          ) {
            row.push(TYPES.EMPTY);
          } else {
            row.push(Math.random() < 0.4 ? TYPES.SOFT : TYPES.EMPTY);
          }
        }
        nextGrid.push(row);
      }
      grid = nextGrid;
    };

    const spawnEnemies = () => {
      const result: Enemy[] = [];
      let enemiesToSpawn = 3;
      let attempts = 0;
      while (enemiesToSpawn > 0 && attempts < 100) {
        attempts += 1;
        const r = Math.floor(Math.random() * (ROWS - 2)) + 1;
        const c = Math.floor(Math.random() * (COLS - 2)) + 1;
        if (grid[r][c] === TYPES.EMPTY && (r > 4 || c > 4)) {
          result.push({
            x: c * TILE_SIZE + TILE_SIZE / 2,
            y: r * TILE_SIZE + TILE_SIZE / 2,
            dir: Math.floor(Math.random() * 4),
            speed: 0.002,
            radius: TILE_SIZE * 0.35,
            alive: true,
          });
          enemiesToSpawn -= 1;
        }
      }
      enemies = result;
    };

    const startGame = () => {
      initGrid();
      player = createPlayer();
      spawnEnemies();
      bombs = [];
      particles = [];
      setState("playing");
      lastTime = performance.now();
    };

    const placeBomb = () => {
      if (currentState !== "playing") return;
      if (player.bombCount >= player.bombLimit) return;
      const c = Math.floor(player.x / TILE_SIZE);
      const r = Math.floor(player.y / TILE_SIZE);
      const hasBomb = bombs.some((b) => b.c === c && b.r === r);
      if (
        !hasBomb &&
        grid[r] &&
        grid[r][c] !== TYPES.WALL &&
        grid[r][c] !== TYPES.SOFT
      ) {
        player.bombCount += 1;
        bombs.push({
          c,
          r,
          timer: 3000,
          radius: player.power,
        });
      }
    };

    actionsRef.current = {
      startGame,
      resetGame: startGame,
      placeBomb,
    };
    setIsReady(true);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space" && !keys.Space) {
        placeBomb();
      }
      if (isKeyCode(event.code)) {
        keys[event.code] = true;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (isKeyCode(event.code)) {
        keys[event.code] = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const maxRadius = 35;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;

    const resetJoystick = () => {
      joystickKnob.style.transition = "transform 0.1s";
      joystickKnob.style.transform = "translate(-50%, -50%)";
      keys.ArrowUp = false;
      keys.ArrowDown = false;
      keys.ArrowLeft = false;
      keys.ArrowRight = false;
    };

    const startJoystick = (clientX: number, clientY: number) => {
      isDragging = true;
      joystickKnob.style.transition = "none";
      const rect = joystickZone.getBoundingClientRect();
      dragStartX = rect.left + rect.width / 2;
      dragStartY = rect.top + rect.height / 2;
      moveJoystick(clientX, clientY);
    };

    const moveJoystick = (clientX: number, clientY: number) => {
      if (!isDragging) return;
      let dx = clientX - dragStartX;
      let dy = clientY - dragStartY;
      const distance = Math.hypot(dx, dy);
      if (distance > maxRadius) {
        const ratio = maxRadius / distance;
        dx *= ratio;
        dy *= ratio;
      }
      joystickKnob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
      const threshold = 10;
      keys.ArrowRight = dx > threshold;
      keys.ArrowLeft = dx < -threshold;
      keys.ArrowDown = dy > threshold;
      keys.ArrowUp = dy < -threshold;
    };

    const endJoystick = () => {
      if (!isDragging) return;
      isDragging = false;
      resetJoystick();
    };

    const touchOptions: AddEventListenerOptions = { passive: false };

    const onTouchStart = (event: TouchEvent) => {
      event.preventDefault();
      const touch = event.touches[0];
      if (touch) startJoystick(touch.clientX, touch.clientY);
    };
    const onTouchMove = (event: TouchEvent) => {
      event.preventDefault();
      const touch = event.touches[0];
      if (touch) moveJoystick(touch.clientX, touch.clientY);
    };
    const onTouchEnd = (event: TouchEvent) => {
      event.preventDefault();
      endJoystick();
    };

    const onMouseDown = (event: MouseEvent) => {
      startJoystick(event.clientX, event.clientY);
    };
    const onMouseMove = (event: MouseEvent) => {
      if (isDragging) {
        moveJoystick(event.clientX, event.clientY);
      }
    };
    const onMouseUp = () => {
      if (isDragging) {
        endJoystick();
      }
    };

    joystickZone.addEventListener("touchstart", onTouchStart, touchOptions);
    joystickZone.addEventListener("touchmove", onTouchMove, touchOptions);
    joystickZone.addEventListener("touchend", onTouchEnd, touchOptions);
    joystickZone.addEventListener("touchcancel", onTouchEnd, touchOptions);
    joystickZone.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchend", onTouchEnd, touchOptions);
    window.addEventListener("touchcancel", onTouchEnd, touchOptions);

    const isPlayerEntity = (ent: Player | Enemy): ent is Player => {
      return "bombLimit" in ent;
    };

    const isSolid = (x: number, y: number, ent: Player | Enemy) => {
      const c = Math.floor(x / TILE_SIZE);
      const r = Math.floor(y / TILE_SIZE);
      if (c < 0 || c >= COLS || r < 0 || r >= ROWS) return true;
      if (grid[r][c] === TYPES.WALL || grid[r][c] === TYPES.SOFT) return true;
      for (const bomb of bombs) {
        if (bomb.c === c && bomb.r === r) {
          const bombX = bomb.c * TILE_SIZE + TILE_SIZE / 2;
          const bombY = bomb.r * TILE_SIZE + TILE_SIZE / 2;
          const overlapThreshold = TILE_SIZE * 0.8;
          const overlap =
            Math.abs(ent.x - bombX) < overlapThreshold &&
            Math.abs(ent.y - bombY) < overlapThreshold;
          if (overlap && isPlayerEntity(ent)) {
            return false;
          }
          return true;
        }
      }
      return false;
    };

    const moveEntity = (ent: Player | Enemy, dx: number, dy: number) => {
      const nextX = ent.x + dx;
      const nextY = ent.y + dy;
      const size = ent.radius;
      const padding = 2;
      let colX = false;
      const cornersX = [
        { x: nextX - size + padding, y: ent.y - size + padding },
        { x: nextX + size - padding, y: ent.y - size + padding },
        { x: nextX - size + padding, y: ent.y + size - padding },
        { x: nextX + size - padding, y: ent.y + size - padding },
      ];
      for (const point of cornersX) {
        if (isSolid(point.x, point.y, ent)) {
          colX = true;
        }
      }
      if (!colX) {
        ent.x = nextX;
      }

      let colY = false;
      const cornersY = [
        { x: ent.x - size + padding, y: nextY - size + padding },
        { x: ent.x + size - padding, y: nextY - size + padding },
        { x: ent.x - size + padding, y: nextY + size - padding },
        { x: ent.x + size - padding, y: nextY + size - padding },
      ];
      for (const point of cornersY) {
        if (isSolid(point.x, point.y, ent)) {
          colY = true;
        }
      }
      if (!colY) {
        ent.y = nextY;
      }

      return !colX && !colY;
    };

    const createFire = (c: number, r: number) => {
      particles.push({ c, r, life: 600 });
    };

    const shakeDuration = 300;
    const shakeMagnitude = 8;
    let shakeTimeLeft = 0;

    const clearShake = () => {
      gameContainer.style.transform = "";
    };

    const triggerShake = () => {
      shakeTimeLeft = shakeDuration;
    };

    const updateShake = (dt: number) => {
      if (shakeTimeLeft > 0) {
        shakeTimeLeft = Math.max(0, shakeTimeLeft - dt);
        const progress = shakeTimeLeft / shakeDuration;
        const magnitude = shakeMagnitude * progress;
        const offsetX = (Math.random() * 2 - 1) * magnitude;
        const offsetY = (Math.random() * 2 - 1) * magnitude;
        gameContainer.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
      } else if (gameContainer.style.transform) {
        clearShake();
      }
    };

    const explodeBomb = (bomb: Bomb) => {
      triggerShake();
      createFire(bomb.c, bomb.r);
      const dirs = [
        [0, -1],
        [0, 1],
        [-1, 0],
        [1, 0],
      ];
      dirs.forEach(([dc, dr]) => {
        for (let step = 1; step <= bomb.radius; step += 1) {
          const nc = bomb.c + dc * step;
          const nr = bomb.r + dr * step;
          if (nc < 0 || nc >= COLS || nr < 0 || nr >= ROWS) break;
          const tile = grid[nr][nc];
          if (tile === TYPES.WALL) break;
          createFire(nc, nr);
          if (tile === TYPES.SOFT) {
            grid[nr][nc] = TYPES.EMPTY;
            break;
          }
        }
      });
    };

    const die = () => {
      if (!player.alive || currentState !== "playing") return;
      player.alive = false;
      setState("gameover");
    };

    const update = (dt: number) => {
      if (currentState !== "playing") return;

      const moveAmt = player.speed * TILE_SIZE * dt;
      let dx = 0;
      let dy = 0;
      if (keys.ArrowUp) dy = -moveAmt;
      if (keys.ArrowDown) dy = moveAmt;
      if (keys.ArrowLeft) dx = -moveAmt;
      if (keys.ArrowRight) dx = moveAmt;
      if (dx !== 0 && dy !== 0) {
        dx *= 0.707;
        dy *= 0.707;
      }
      moveEntity(player, dx, dy);

      enemies.forEach((enemy) => {
        const moveDist = enemy.speed * TILE_SIZE * dt;
        let ex = 0;
        let ey = 0;
        if (enemy.dir === 0) ey = -moveDist;
        else if (enemy.dir === 1) ex = moveDist;
        else if (enemy.dir === 2) ey = moveDist;
        else if (enemy.dir === 3) ex = -moveDist;
        const moved = moveEntity(enemy, ex, ey);
        if (!moved || Math.random() < 0.005) {
          enemy.dir = Math.floor(Math.random() * 4);
          const gridX =
            Math.floor(enemy.x / TILE_SIZE) * TILE_SIZE + TILE_SIZE / 2;
          const gridY =
            Math.floor(enemy.y / TILE_SIZE) * TILE_SIZE + TILE_SIZE / 2;
          if (Math.hypot(enemy.x - gridX, enemy.y - gridY) < 4) {
            enemy.x = gridX;
            enemy.y = gridY;
          }
        }
        if (
          Math.hypot(player.x - enemy.x, player.y - enemy.y) <
          player.radius + enemy.radius - 4
        ) {
          die();
        }
      });

      for (let i = bombs.length - 1; i >= 0; i -= 1) {
        const bomb = bombs[i];
        bomb.timer -= dt;
        if (bomb.timer <= 0) {
          explodeBomb(bomb);
          bombs.splice(i, 1);
          player.bombCount = Math.max(0, player.bombCount - 1);
        }
      }

      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const particle = particles[i];
        particle.life -= dt;
        const pX = particle.c * TILE_SIZE + TILE_SIZE / 2;
        const pY = particle.r * TILE_SIZE + TILE_SIZE / 2;
        if (
          Math.hypot(player.x - pX, player.y - pY) <
          player.radius + TILE_SIZE / 2 - 4
        ) {
          die();
        }
        for (let j = enemies.length - 1; j >= 0; j -= 1) {
          const enemy = enemies[j];
          if (
            Math.hypot(enemy.x - pX, enemy.y - pY) <
            enemy.radius + TILE_SIZE / 2 - 4
          ) {
            enemies.splice(j, 1);
          }
        }
        if (particle.life <= 0) {
          particles.splice(i, 1);
        }
      }

      if (enemies.length === 0) {
        setState("win");
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const type = grid[r][c];
          const x = c * TILE_SIZE;
          const y = r * TILE_SIZE;
          if (type === TYPES.WALL) {
            ctx.fillStyle = "#95a5a6";
            ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
            ctx.strokeStyle = "#7f8c8d";
            ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
            ctx.fillStyle = "rgba(0,0,0,0.2)";
            ctx.fillRect(x, y + TILE_SIZE - 4, TILE_SIZE, 4);
          } else if (type === TYPES.SOFT) {
            ctx.fillStyle = "#d35400";
            ctx.fillRect(x + 1, y + 1, TILE_SIZE - 2, TILE_SIZE - 2);
            ctx.fillStyle = "#e67e22";
            ctx.fillRect(x + 2, y + 2, TILE_SIZE - 4, 6);
            ctx.fillRect(x + 2, y + 10, TILE_SIZE - 4, 6);
            ctx.fillRect(x + 2, y + 18, TILE_SIZE - 4, 6);
          } else if ((r + c) % 2 === 0) {
            ctx.fillStyle = "rgba(0,0,0,0.05)";
            ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
          }
        }
      }

      bombs.forEach((bomb) => {
        const x = bomb.c * TILE_SIZE + TILE_SIZE / 2;
        const y = bomb.r * TILE_SIZE + TILE_SIZE / 2;
        ctx.fillStyle = "#2c3e50";
        ctx.beginPath();
        ctx.arc(x, y, TILE_SIZE * 0.4, 0, Math.PI * 2);
        ctx.fill();
        const flash =
          bomb.timer < 1000 && Math.floor(Date.now() / 100) % 2 === 0;
        ctx.fillStyle = flash ? "#ffffff" : "#c0392b";
        ctx.beginPath();
        ctx.arc(x + 4, y - 4, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      particles.forEach((particle) => {
        const x = particle.c * TILE_SIZE;
        const y = particle.r * TILE_SIZE;
        const alpha = particle.life / 600;
        ctx.fillStyle = `rgba(241,196,15,${alpha})`;
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        ctx.fillStyle = `rgba(231,76,60,${alpha})`;
        ctx.fillRect(x + 4, y + 4, TILE_SIZE - 8, TILE_SIZE - 8);
      });

      enemies.forEach((enemy) => {
        ctx.fillStyle = "#e74c3c";
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(enemy.x - 5, enemy.y - 3, 3, 3);
        ctx.fillRect(enemy.x + 2, enemy.y - 3, 3, 3);
      });

      if (player.alive) {
        ctx.fillStyle = "#ecf0f1";
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#3498db";
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.radius, Math.PI, 0);
        ctx.fill();
      }
    };

    const gameLoop = (timestamp: number) => {
      let dt = timestamp - lastTime;
      if (dt > 50) dt = 50;
      lastTime = timestamp;
      update(dt);
      draw();
      updateShake(dt);
      animationFrame = requestAnimationFrame(gameLoop);
    };

    animationFrame = requestAnimationFrame(gameLoop);

    return () => {
      destroyed = true;
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("resize", resizeCanvas);
      joystickZone.removeEventListener("touchstart", onTouchStart, touchOptions);
      joystickZone.removeEventListener("touchmove", onTouchMove, touchOptions);
      joystickZone.removeEventListener("touchend", onTouchEnd, touchOptions);
      joystickZone.removeEventListener("touchcancel", onTouchEnd, touchOptions);
      joystickZone.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchend", onTouchEnd, touchOptions);
      window.removeEventListener("touchcancel", onTouchEnd, touchOptions);
      cancelAnimationFrame(animationFrame);
      actionsRef.current = null;
      clearShake();
    };
  }, [setGameState, setIsReady]);

  const handleStart = useCallback(() => {
    actionsRef.current?.startGame();
  }, []);

  const handleReset = useCallback(() => {
    actionsRef.current?.resetGame();
  }, []);

  const handleBombDown = useCallback(
    (
      event:
        | ReactMouseEvent<HTMLButtonElement>
        | ReactTouchEvent<HTMLButtonElement>
    ) => {
      event.preventDefault();
      actionsRef.current?.placeBomb();
      setIsBombPressed(true);
    },
    []
  );

  const handleBombUp = useCallback(
    (
      event:
        | ReactMouseEvent<HTMLButtonElement>
        | ReactTouchEvent<HTMLButtonElement>
    ) => {
      event.preventDefault();
      setIsBombPressed(false);
    },
    []
  );

  const handleBombLeave = useCallback(() => {
    setIsBombPressed(false);
  }, []);

  const renderMessage = () => {
    if (gameState === "start") {
      return (
        <div className={styles.messageBox}>
          <h2 className={styles.messageTitle}>Bomberman</h2>
          <button
            type="button"
            className={styles.messageButton}
            onClick={handleStart}
            disabled={!isReady}
          >
            Start Game
          </button>
        </div>
      );
    }
    if (gameState === "gameover") {
      return (
        <div className={styles.messageBox}>
          <h2 className={styles.messageTitle} style={{ color: "#e74c3c" }}>
            Game Over
          </h2>
          <button
            type="button"
            className={styles.messageButton}
            onClick={handleReset}
          >
            Try Again
          </button>
        </div>
      );
    }
    if (gameState === "win") {
      return (
        <div className={styles.messageBox}>
          <h2 className={styles.messageTitle} style={{ color: "#f1c40f" }}>
            Victory!
          </h2>
          <button
            type="button"
            className={styles.messageButton}
            onClick={handleReset}
          >
            Play Again
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.wrapper}>
      {onClose && (
        <button
          type="button"
          aria-label="Close game"
          className={styles.closeButton}
          onClick={onClose}
        >
          ✕
        </button>
      )}
      <div ref={gameContainerRef} className={styles.gameContainer}>
        <canvas ref={canvasRef} className={styles.canvas} />
        <div className={styles.uiLayer}>{renderMessage()}</div>
      </div>
      <div className={styles.controls}>
        <div ref={joystickZoneRef} className={styles.joystickZone}>
          <div ref={joystickKnobRef} className={styles.joystickKnob} />
        </div>
        <button
          type="button"
          className={`${styles.bombButton} ${
            isBombPressed ? styles.bombButtonPressed : ""
          }`}
          onMouseDown={handleBombDown}
          onMouseUp={handleBombUp}
          onMouseLeave={handleBombLeave}
          onTouchStart={handleBombDown}
          onTouchEnd={handleBombUp}
          onTouchCancel={handleBombLeave}
        >
          {"\uD83D\uDCA3"}
        </button>
      </div>
    </div>
  );
}
