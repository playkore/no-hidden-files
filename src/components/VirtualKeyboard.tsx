type NavigationAction = "up" | "down" | "left" | "right" | "enter";

interface VirtualKeyboardProps {
  onNavigate: (action: NavigationAction) => void;
}

export function VirtualKeyboard({ onNavigate }: VirtualKeyboardProps) {
  return (
    <div className="virtual-keyboard">
      <div className="key-pad">
        <button
          type="button"
          className="key key-up"
          aria-label="Move up"
          onClick={() => onNavigate("up")}
        >
          <span>▲</span>
        </button>
        <button
          type="button"
          className="key key-left"
          aria-label="Go to parent directory"
          onClick={() => onNavigate("left")}
        >
          <span>◄</span>
        </button>
        <button
          type="button"
          className="key key-down"
          aria-label="Move down"
          onClick={() => onNavigate("down")}
        >
          <span>▼</span>
        </button>
        <button
          type="button"
          className="key key-right"
          aria-label="Enter selection"
          onClick={() => onNavigate("right")}
        >
          <span>►</span>
        </button>
        <button
          type="button"
          className="key key-enter"
          aria-label="Enter selection"
          onClick={() => onNavigate("enter")}
        >
          <span>Enter</span>
        </button>
      </div>
    </div>
  );
}
