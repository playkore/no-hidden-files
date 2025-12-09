import styles from "./VirtualKeyboard.module.css";

type NavigationAction = "up" | "down" | "left" | "right" | "enter";

interface VirtualKeyboardProps {
  onNavigate: (action: NavigationAction) => void;
}

export function VirtualKeyboard({ onNavigate }: VirtualKeyboardProps) {
  return (
    <div className={styles.virtualKeyboard}>
      <div className={styles.keyPad}>
        <button
          type="button"
          className={`${styles.key} ${styles.keyUp}`}
          aria-label="Move up"
          onClick={() => onNavigate("up")}
        >
          <span>▲</span>
        </button>
        <button
          type="button"
          className={`${styles.key} ${styles.keyLeft}`}
          aria-label="Go to parent directory"
          onClick={() => onNavigate("left")}
        >
          <span>◄</span>
        </button>
        <button
          type="button"
          className={`${styles.key} ${styles.keyDown}`}
          aria-label="Move down"
          onClick={() => onNavigate("down")}
        >
          <span>▼</span>
        </button>
        <button
          type="button"
          className={`${styles.key} ${styles.keyRight}`}
          aria-label="Enter selection"
          onClick={() => onNavigate("right")}
        >
          <span>►</span>
        </button>
        <button
          type="button"
          className={`${styles.key} ${styles.keyEnter}`}
          aria-label="Enter selection"
          onClick={() => onNavigate("enter")}
        >
          <span>Enter</span>
        </button>
      </div>
    </div>
  );
}
