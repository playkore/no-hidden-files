import { useCallback, useEffect, useState } from "react";
import type { TouchEvent } from "react";
import type { FsNode } from "./fs/types";
import { useFileSystem } from "./hooks/useFileSystem";
import { useCommandPrompt } from "./hooks/useCommandPrompt";
import { useSelectionBlink } from "./hooks/useSelectionBlink";
import { formatPath } from "./utils/path";
import { NcScreen } from "./components/NcScreen";
import { NcViewer } from "./components/NcViewer";
import type { ExecutableId } from "./executables/registry";
import { getExecutableComponent } from "./executables/registry";
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
  const [activeExecutableId, setActiveExecutableId] =
    useState<ExecutableId | null>(null);
  const [viewerEntry, setViewerEntry] = useState<{
    title: string;
    content: string;
  } | null>(null);
  const { isBlinking, blink } = useSelectionBlink();
  const entriesLength = entries.length;
  const closeViewer = useCallback(() => setViewerEntry(null), [setViewerEntry]);

  const clampIndex = useCallback(
    (index: number) => {
      const max = Math.max(entriesLength - 1, 0);
      return Math.max(0, Math.min(index, max));
    },
    [entriesLength]
  );

  const activateEntry = useCallback(
    async (entry?: FsNode) => {
      if (!entry) {
        return;
      }

      await blink();

      if (entry.executableId) {
        setActiveExecutableId(entry.executableId);
        return;
      }

      if (entry.content) {
        setViewerEntry({ title: entry.name, content: entry.content });
        return;
      }

      if (entry.name === "..") {
        goToParent();
      } else if (entry.type === "dir") {
        enterDirectory(entry.name);
      }
    },
    [blink, enterDirectory, goToParent, setActiveExecutableId, setViewerEntry]
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
      if (activeExecutableId || viewerEntry) {
        return;
      }
      if (e.key === "ArrowDown") {
        setSelectedIndex((i) => clampIndex(i + 1));
      } else if (e.key === "ArrowUp") {
        setSelectedIndex((i) => clampIndex(i - 1));
      } else if (e.key === "ArrowLeft") {
        goToParent();
      } else if (e.key === "ArrowRight") {
        activateEntry(selectedEntry);
      } else if (e.key === "Enter") {
        activateEntry(selectedEntry);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    activeExecutableId,
    activateEntry,
    clampIndex,
    goToParent,
    selectedEntry,
    setSelectedIndex,
    viewerEntry,
  ]);

  useEffect(() => {
    function onViewerKey(e: KeyboardEvent) {
      if (!viewerEntry) return;
      if (e.key === "Escape" || e.key === "F3") {
        e.preventDefault();
        closeViewer();
      }
    }

    window.addEventListener("keydown", onViewerKey);
    return () => window.removeEventListener("keydown", onViewerKey);
  }, [closeViewer, viewerEntry]);

  const handleEntryInteraction = useCallback(
    (entry: FsNode, index: number) => {
      const nextIndex = clampIndex(index);
      if (safeIndex === nextIndex) {
        activateEntry(entry);
      } else {
        setSelectedIndex(nextIndex);
      }
    },
    [activateEntry, clampIndex, safeIndex, setSelectedIndex]
  );

  const handleTouch = useCallback(
    (event: TouchEvent<HTMLButtonElement>, entry: FsNode, index: number) => {
      event.preventDefault();
      handleEntryInteraction(entry, index);
    },
    [handleEntryInteraction]
  );

  const ActiveExecutableComponent = activeExecutableId
    ? getExecutableComponent(activeExecutableId)
    : null;

  return (
    <div className={styles.app}>
      <NcScreen
        menuItems={menuItems}
        footerKeys={footerKeys}
        currentPathLabel={currentPathLabel}
        entries={entries}
        safeIndex={safeIndex}
        isBlinking={isBlinking}
        handleEntryInteraction={handleEntryInteraction}
        handleTouch={handleTouch}
        formatSize={formatSize}
        formatDateText={formatDateText}
        promptText={promptText}
        promptInputValue={promptInputValue}
      />
      {ActiveExecutableComponent && (
        <div className={styles.overlay}>
          <div className={styles.gameWindow}>
            <ActiveExecutableComponent
              onClose={() => setActiveExecutableId(null)}
            />
          </div>
        </div>
      )}
      {viewerEntry && (
        <div className={`${styles.overlay} ${styles.viewerOverlay}`}>
          <div className={styles.viewerWindow}>
            <NcViewer
              title={viewerEntry.title}
              content={viewerEntry.content}
              onClose={closeViewer}
            />
          </div>
        </div>
      )}
    </div>
  );
}
