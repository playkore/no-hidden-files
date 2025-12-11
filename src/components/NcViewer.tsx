import styles from "./NcViewer.module.css";

interface NcViewerProps {
  title: string;
  content: string;
  onClose: () => void;
}

export function NcViewer({ title, content, onClose }: NcViewerProps) {
  return (
    <div className={styles.viewer}>
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        <button type="button" className={styles.closeButton} onClick={onClose}>
          Close
        </button>
      </div>
      <div className={styles.body}>
        <pre className={styles.content}>{content}</pre>
      </div>
      <div className={styles.footer}>
        <span>F3 Close</span>
        <span>Esc Close</span>
      </div>
    </div>
  );
}
