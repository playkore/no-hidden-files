import type { FsPath } from "../fs/types";

/**
 * Formats a filesystem path for display using a DOS-like style (e.g. C:\GAMES).
 */
export function formatPath(disk: string, path: FsPath): string {
  const diskLetter = (disk?.[0] ?? "C").toUpperCase();
  if (!path.length) {
    return `${diskLetter}:\\`;
  }

  const upper = path.map((segment) => segment.toUpperCase()).join("\\");
  return `${diskLetter}:\\${upper}`;
}
