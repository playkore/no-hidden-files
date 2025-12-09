import type { Dispatch, SetStateAction } from "react";
import type { FsNode } from "../fs/types";

interface FooterKey {
  key: number;
  label: string;
}

interface NcScreenProps {
  menuItems: string[];
  footerKeys: FooterKey[];
  currentPathLabel: string;
  entries: FsNode[];
  safeIndex: number;
  clampIndex: (index: number) => number;
  changeDirectory: (entry?: FsNode) => void;
  setSelectedIndex: Dispatch<SetStateAction<number>>;
  handleTouch: (entry: FsNode, index: number, timeStamp: number) => void;
  formatSize: (entry: FsNode) => string;
  formatDateText: (date?: string) => string;
  promptText: string;
  promptInputValue: string;
}

export function NcScreen({
  menuItems,
  footerKeys,
  currentPathLabel,
  entries,
  safeIndex,
  clampIndex,
  changeDirectory,
  setSelectedIndex,
  handleTouch,
  formatSize,
  formatDateText,
  promptText,
  promptInputValue,
}: NcScreenProps) {
  return (
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
                <span className="file-date">{formatDateText(entry.date)}</span>
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
  );
}
