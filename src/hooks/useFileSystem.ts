import { useCallback, useMemo } from "react";
import { atom, useAtom, useAtomValue } from "jotai";
import { sampleFs } from "../fs/sampleFs";
import {
  getSelectionIndexForPathChange,
  resolveEntries,
} from "../fs/navigation";
import type { FileSystem, FsPath } from "../fs/types";

const fsAtom = atom<FileSystem>(sampleFs);
const currentPathAtom = atom<FsPath>([]);
const selectedIndexAtom = atom<number>(0);
const diskAtom = atom<string>("C");

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
    const nextSelection = getSelectionIndexForPathChange(
      fs,
      currentPath,
      parentPath
    );

    setCurrentPath(parentPath);
    setSelectedIndex(nextSelection);
  }, [currentPath, fs, setCurrentPath, setSelectedIndex]);

  const enterDirectory = useCallback(
    (dirName: string) => {
      const nextPath = [...currentPath, dirName];
      const nextSelection = getSelectionIndexForPathChange(
        fs,
        currentPath,
        nextPath
      );

      setCurrentPath(nextPath);
      setSelectedIndex(nextSelection);
    },
    [currentPath, fs, setCurrentPath, setSelectedIndex]
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
