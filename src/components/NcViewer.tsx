import styles from "./NcViewer.module.css";

interface NcViewerProps {
  title: string;
  content: string;
  onClose: () => void;
}

export function NcViewer({ title, content, onClose }: NcViewerProps) {
  const byteCount = new Blob([content]).size;
  const formattedBytes = byteCount.toLocaleString("en-US");
  const footerKeys = [
    { key: 1, label: "" },
    { key: 2, label: "" },
    { key: 3, label: "" },
    { key: 4, label: "" },
    { key: 5, label: "Quit", onClick: () => onClose() },
  ];

  return (
    <div className={styles.viewer}>
      <div className={styles.titleBar}>
        <div className={styles.titleGroup}>
          <span className={styles.viewLabel}>View:</span>
          <span className={styles.title}>{title}</span>
        </div>
        <div className={styles.headerMeta}>
          <span>Col 0</span>
          <span>{formattedBytes} Bytes</span>
          <span>100%</span>
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.contentWindow}>
          <pre className={styles.content}>{content}</pre>
        </div>
      </div>
      <div className={styles.footerKeys}>
        {footerKeys.map((footerKey) => (
          <button
            key={footerKey.key}
            type="button"
            className={styles.fKey}
            onClick={footerKey.onClick ? footerKey.onClick : undefined}
          >
            {footerKey.label && (
              <span className={styles.keyNum}>{footerKey.key}</span>
            )}
            {footerKey.label}
          </button>
        ))}
      </div>
    </div>
  );
}
