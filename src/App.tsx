import { useCallback, useEffect, useRef } from "react";
import type { FsNode } from "./fs/types";
import { useFileSystem } from "./hooks/useFileSystem";
import { useCommandPrompt } from "./hooks/useCommandPrompt";
import { formatPath } from "./utils/path";

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
      } else if (e.key === "Enter") {
        changeDirectory(selectedEntry);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [changeDirectory, clampIndex, selectedEntry, setSelectedIndex]);

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
    <div className="app">
      <div className="nc-screen">
        <div className="menu-bar">
          {menuItems.map((item) => (
            <button key={item} type="button" className="menu-item">
              {item}
            </button>
          ))}
        </div>

        <div className="panel">
          <div className="panel-header">{currentPathLabel}</div>
          <div className="panel-cols">
            <div className="col-name">Name</div>
            <div className="col-size">Size</div>
            <div className="col-date">Date</div>
          </div>

          <div className="file-list">
            {entries.map((entry, index) => {
              const isActive = index === safeIndex;
              const rowClass = [
                "file-row",
                isActive ? "active" : "",
                entry.type === "dir" ? "is-dir" : "",
              ]
                .filter(Boolean)
                .join(" ");
              return (
                <button
                  type="button"
                  key={`${entry.name}-${index}`}
                  className={rowClass}
                  onClick={() => setSelectedIndex(clampIndex(index))}
                  onDoubleClick={() => changeDirectory(entry)}
                  onTouchEnd={(event) =>
                    handleTouch(entry, index, event.timeStamp)
                  }
                >
                  <span className="file-name">{entry.name}</span>
                  <span className="file-size">{formatSize(entry)}</span>
                  <span className="file-date">
                    {formatDateText(entry.date)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="cmd-prompt">
          <span className="prompt-text">{promptText}</span>
          <input
            type="text"
            className="cmd-input"
            value={promptInputValue}
            readOnly
          />
        </div>

        <div className="footer-keys">
          {footerKeys.map((footerKey) => (
            <button key={footerKey.key} type="button" className="f-key">
              <span className="key-num">{footerKey.key}</span>
              {footerKey.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
