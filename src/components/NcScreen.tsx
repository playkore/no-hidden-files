import type { TouchEvent } from "react";
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
  isBlinking: boolean;
  handleEntryInteraction: (entry: FsNode, index: number) => void;
  handleTouch: (
    event: TouchEvent<HTMLButtonElement>,
    entry: FsNode,
    index: number
  ) => void;
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
  isBlinking,
  handleEntryInteraction,
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
            const shouldBlink = isBlinking && isActive;
            const rowClass = [
              styles.fileRow,
              isActive ? styles.active : "",
              entry.type === "dir" ? styles.isDir : "",
              shouldBlink ? styles.blinking : "",
            ]
              .filter(Boolean)
              .join(" ");
            return (
              <button
                type="button"
                key={`${entry.name}-${index}`}
                className={rowClass}
                onClick={() => handleEntryInteraction(entry, index)}
                onTouchEnd={(event) => handleTouch(event, entry, index)}
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
