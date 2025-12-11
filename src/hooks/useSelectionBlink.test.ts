import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useSelectionBlink } from "./useSelectionBlink";

describe("useSelectionBlink", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("should initially not be blinking", () => {
    const { result } = renderHook(() => useSelectionBlink());
    expect(result.current.isBlinking).toBe(false);
  });

  it("should set isBlinking to true immediately when blink is called", async () => {
    const { result } = renderHook(() => useSelectionBlink());

    let blinkPromise: Promise<void>;
    act(() => {
      blinkPromise = result.current.blink();
    });

    expect(result.current.isBlinking).toBe(true);

    await act(async () => {
      vi.advanceTimersByTime(500);
      await blinkPromise;
    });

    expect(result.current.isBlinking).toBe(false);
  });

  it("should execute after default duration and reset isBlinking", async () => {
    const { result } = renderHook(() => useSelectionBlink());

    let blinkPromise: Promise<void>;
    act(() => {
      blinkPromise = result.current.blink();
    });

    expect(result.current.isBlinking).toBe(true);

    await act(async () => {
      vi.advanceTimersByTime(500);
      await blinkPromise;
    });

    expect(result.current.isBlinking).toBe(false);
  });

  it("should execute after custom duration", async () => {
    const { result } = renderHook(() =>
      useSelectionBlink({ blinkDuration: 300 })
    );

    let blinkPromise: Promise<void>;
    act(() => {
      blinkPromise = result.current.blink();
    });

    await act(async () => {
      vi.advanceTimersByTime(300);
      await blinkPromise;
    });

    expect(result.current.isBlinking).toBe(false);
  });

  it("should not start new blink if already blinking", async () => {
    const { result } = renderHook(() => useSelectionBlink());

    let blinkPromise1: Promise<void>;
    let blinkPromise2: Promise<void>;
    act(() => {
      blinkPromise1 = result.current.blink();
      blinkPromise2 = result.current.blink();
    });

    await act(async () => {
      vi.advanceTimersByTime(500);
      await Promise.all([blinkPromise1, blinkPromise2]);
    });

    expect(result.current.isBlinking).toBe(false);
  });

  it("should cancel the blink and reset state", () => {
    const { result } = renderHook(() => useSelectionBlink());

    let blinkPromise: Promise<void>;
    act(() => {
      blinkPromise = result.current.blink();
    });

    expect(result.current.isBlinking).toBe(true);

    act(() => {
      result.current.cancel();
    });

    expect(result.current.isBlinking).toBe(false);

    // After cancel, the promise won't resolve, so we just verify state
    // No need to wait for the promise or advance timers
  });

  it("should allow new blink after previous completion", async () => {
    const { result } = renderHook(() => useSelectionBlink());

    let blinkPromise1: Promise<void>;
    act(() => {
      blinkPromise1 = result.current.blink();
    });

    await act(async () => {
      vi.advanceTimersByTime(500);
      await blinkPromise1;
    });

    expect(result.current.isBlinking).toBe(false);

    let blinkPromise2: Promise<void>;
    act(() => {
      blinkPromise2 = result.current.blink();
    });

    await act(async () => {
      vi.advanceTimersByTime(500);
      await blinkPromise2;
    });

    expect(result.current.isBlinking).toBe(false);
  });
});
