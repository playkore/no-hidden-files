import type { Dispatch, SetStateAction } from "react";
import type { FsNode } from "../fs/types";
import styles from "./NcScreen.module.css";

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
    <div className={styles.ncScreen}>
      <div className={styles.menuBar}>
        {menuItems.map((item) => (
          <button key={item} type="button" className={styles.menuItem}>
            {item}
          </button>
        ))}
      </div>

      <div className={styles.panel}>
        <div className={styles.panelHeader}>{currentPathLabel}</div>
        <div className={styles.panelCols}>
          <div className={styles.colName}>Name</div>
          <div className={styles.colSize}>Size</div>
          <div className={styles.colDate}>Date</div>
        </div>

        <div className={styles.fileList}>
          {entries.map((entry, index) => {
            const isActive = index === safeIndex;
            const rowClass = [
              styles.fileRow,
              isActive ? styles.active : "",
              entry.type === "dir" ? styles.isDir : "",
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
                <span className={styles.fileName}>{entry.name}</span>
                <span className={styles.fileSize}>{formatSize(entry)}</span>
                <span className={styles.fileDate}>
                  {formatDateText(entry.date)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.cmdPrompt}>
        <span className={styles.promptText}>{promptText}</span>
        <input
          type="text"
          className={styles.cmdInput}
          value={promptInputValue}
          readOnly
        />
      </div>

      <div className={styles.footerKeys}>
        {footerKeys.map((footerKey) => (
          <button key={footerKey.key} type="button" className={styles.fKey}>
            <span className={styles.keyNum}>{footerKey.key}</span>
            {footerKey.label}
          </button>
        ))}
      </div>
    </div>
  );
}
