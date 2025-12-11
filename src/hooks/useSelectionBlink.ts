import { useCallback, useRef, useState } from "react";

interface UseSelectionBlinkOptions {
  blinkDuration?: number;
}

export function useSelectionBlink(options: UseSelectionBlinkOptions = {}) {
  const { blinkDuration = 500 } = options;
  const [isBlinking, setIsBlinking] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const isBlinkingRef = useRef(false);

  const blink = useCallback(() => {
    if (isBlinkingRef.current) return Promise.resolve();

    isBlinkingRef.current = true;
    setIsBlinking(true);

    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }

    return new Promise<void>((resolve) => {
      timeoutRef.current = window.setTimeout(() => {
        isBlinkingRef.current = false;
        setIsBlinking(false);
        timeoutRef.current = null;
        resolve();
      }, blinkDuration);
    });
  }, [blinkDuration]);

  const cancel = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      isBlinkingRef.current = false;
      setIsBlinking(false);
    }
  }, []);

  return {
    isBlinking,
    blink,
    cancel,
  };
}
