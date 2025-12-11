import type { FileSystem, FsNode, FsPath } from "./types";

// Traverses the filesystem tree using the provided path segments.
export function getNode(fs: FileSystem, path: FsPath): FsNode {
  let node: FsNode = fs;
  for (const segment of path) {
    const next = node.children?.find((child) => child.name === segment);
    if (!next) {
      break;
    }
    node = next;
  }
  return node;
}

// Returns the visible entries for the path, including a synthetic "..".
export function resolveEntries(fs: FileSystem, path: FsPath): FsNode[] {
  const node = getNode(fs, path);

  const items = node.children ?? [];
  if (path.length === 0) {
    return items;
  }

  const parentEntry: FsNode = { name: "..", type: "dir", date: node.date };
  return [parentEntry, ...items];
}

function isEnteringSubdirectory(previous: FsPath, next: FsPath) {
  if (next.length !== previous.length + 1) return false;
  return previous.every((segment, index) => segment === next[index]);
}

function isReturningToParent(previous: FsPath, next: FsPath) {
  if (previous.length !== next.length + 1) return false;
  return next.every((segment, index) => segment === previous[index]);
}

// Determines which entry should be highlighted after changing directories.
export function getSelectionIndexForPathChange(
  fs: FileSystem,
  previousPath: FsPath,
  nextPath: FsPath
): number {
  if (isEnteringSubdirectory(previousPath, nextPath)) {
    return 0;
  }

  if (isReturningToParent(previousPath, nextPath)) {
    const originDir = previousPath[previousPath.length - 1];
    const parentEntries = resolveEntries(fs, nextPath);
    const originIndex = parentEntries.findIndex(
      (entry) => entry.name === originDir
    );
    return originIndex >= 0 ? originIndex : 0;
  }

  return 0;
}
