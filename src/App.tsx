import { useCallback, useEffect, useRef } from "react";
import type { FsNode } from "./fs/types";
import { useFileSystem } from "./hooks/useFileSystem";
import { useCommandPrompt } from "./hooks/useCommandPrompt";
import { formatPath } from "./utils/path";
import { NcScreen } from "./components/NcScreen";
import { VirtualKeyboard } from "./components/VirtualKeyboard";
import styles from "./App.module.css";

const menuItems = ["Left", "File", "Disk", "Cards", "Right"];

const footerKeys = [
  { key: 1, label: "Help" },
  { key: 2, label: "User" },
  { key: 3, label: "View" },
  { key: 4, label: "Edit" },
  { key: 5, label: "Copy" },
];

const sizeFormatter = new Intl.NumberFormat("en-US");

function formatSize(entry: FsNode): string {
  if (entry.name === "..") return "UP-DIR";
  if (entry.type === "dir") return "<DIR>";
  if (typeof entry.size === "number") {
    return sizeFormatter.format(entry.size);
  }
  return "";
}

function formatDateText(date?: string): string {
  if (!date) return "";
  const parts = date.split("-");
  if (parts.length === 3) {
    const [year, month, day] = parts as [string, string, string];
    const shortYear = year.slice(-2);
    return `${month.padStart(2, "0")}-${day.padStart(2, "0")}-${shortYear}`;
  }
  return date;
}

export default function App() {
  const {
    entries,
    currentPath,
    selectedIndex,
    setSelectedIndex,
    goToParent,
    enterDirectory,
    disk,
  } = useFileSystem();
  const lastTapRef = useRef<{ index: number; time: number }>({
    index: -1,
    time: 0,
  });
  const entriesLength = entries.length;

  const clampIndex = useCallback(
    (index: number) => {
      const max = Math.max(entriesLength - 1, 0);
      return Math.max(0, Math.min(index, max));
    },
    [entriesLength]
  );

  const changeDirectory = useCallback(
    (entry?: FsNode) => {
      if (!entry) return;
      if (entry.name === "..") {
        goToParent();
      } else if (entry.type === "dir") {
        enterDirectory(entry.name);
      }
    },
    [enterDirectory, goToParent]
  );

  const safeIndex = clampIndex(selectedIndex);
  const selectedEntry = entries[safeIndex];
  const currentPathLabel = formatPath(disk, currentPath);
  const { promptText, promptInputValue } = useCommandPrompt({
    disk,
    currentPath,
    selectedEntry,
  });

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowDown") {
        setSelectedIndex((i) => clampIndex(i + 1));
      } else if (e.key === "ArrowUp") {
        setSelectedIndex((i) => clampIndex(i - 1));
      } else if (e.key === "ArrowLeft") {
        goToParent();
      } else if (e.key === "ArrowRight") {
        changeDirectory(selectedEntry);
      } else if (e.key === "Enter") {
        changeDirectory(selectedEntry);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    changeDirectory,
    clampIndex,
    goToParent,
    selectedEntry,
    setSelectedIndex,
  ]);

  const handleVirtualNavigation = useCallback(
    (action: "up" | "down" | "left" | "right" | "enter") => {
      if (action === "up") {
        setSelectedIndex((i) => clampIndex(i - 1));
      } else if (action === "down") {
        setSelectedIndex((i) => clampIndex(i + 1));
      } else if (action === "left") {
        goToParent();
      } else {
        changeDirectory(selectedEntry);
      }
    },
    [changeDirectory, clampIndex, goToParent, selectedEntry, setSelectedIndex]
  );

  function handleTouch(entry: FsNode, index: number, timeStamp: number) {
    setSelectedIndex(clampIndex(index));
    const { index: lastIndex, time } = lastTapRef.current;
    if (lastIndex === index && timeStamp - time < 350) {
      changeDirectory(entry);
      lastTapRef.current = { index: -1, time: 0 };
    } else {
      lastTapRef.current = { index, time: timeStamp };
    }
  }

  return (
    <div className={styles.app}>
      <NcScreen
        menuItems={menuItems}
        footerKeys={footerKeys}
        currentPathLabel={currentPathLabel}
        entries={entries}
        safeIndex={safeIndex}
        clampIndex={clampIndex}
        changeDirectory={changeDirectory}
        setSelectedIndex={setSelectedIndex}
        handleTouch={handleTouch}
        formatSize={formatSize}
        formatDateText={formatDateText}
        promptText={promptText}
        promptInputValue={promptInputValue}
      />
      <VirtualKeyboard onNavigate={handleVirtualNavigation} />
    </div>
  );
}
