import { useCallback, useMemo } from "react";
import { atom, useAtom, useAtomValue } from "jotai";
import { sampleFs } from "../fs/sampleFs";
import type { FileSystem, FsNode, FsPath } from "../fs/types";

const fsAtom = atom<FileSystem>(sampleFs);
const currentPathAtom = atom<FsPath>([]);
const selectedIndexAtom = atom<number>(0);
const diskAtom = atom<string>("C");

function getNode(fs: FileSystem, path: FsPath): FsNode {
  let node: FsNode = fs;
  for (const segment of path) {
    const next = node.children?.find((child) => child.name === segment);
    if (!next) break;
    node = next;
  }
  return node;
}

function resolveEntries(fs: FileSystem, path: FsPath): FsNode[] {
  const node = getNode(fs, path);

  const items = node.children ?? [];
  const parentEntry: FsNode = { name: "..", type: "dir", date: node.date };
  return [parentEntry, ...items];
}

export function useFileSystem() {
  const fs = useAtomValue(fsAtom);
  const [currentPath, setCurrentPath] = useAtom(currentPathAtom);
  const [selectedIndex, setSelectedIndex] = useAtom(selectedIndexAtom);
  const [disk, setDisk] = useAtom(diskAtom);

  const entries = useMemo(
    () => resolveEntries(fs, currentPath),
    [fs, currentPath]
  );

  const goToParent = useCallback(() => {
    if (currentPath.length === 0) {
      setSelectedIndex(0);
      return;
    }

    const parentPath = currentPath.slice(0, -1);
    setCurrentPath(parentPath);
    setSelectedIndex(0);
  }, [currentPath, setCurrentPath, setSelectedIndex]);

  const enterDirectory = useCallback(
    (dirName: string) => {
      setCurrentPath((path) => [...path, dirName]);
      setSelectedIndex(0);
    },
    [setCurrentPath, setSelectedIndex]
  );

  return {
    entries,
    currentPath,
    selectedIndex,
    setSelectedIndex,
    goToParent,
    enterDirectory,
    disk,
    setDisk,
  };
}
