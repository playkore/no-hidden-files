import { useMemo } from "react";
import type { FsNode, FsPath } from "../fs/types";
import { formatPath } from "../utils/path";

interface UseCommandPromptOptions {
  disk: string;
  currentPath: FsPath;
  selectedEntry?: FsNode;
}

export function useCommandPrompt({
  disk,
  currentPath,
  selectedEntry,
}: UseCommandPromptOptions) {
  const promptText = useMemo(
    () => `${formatPath(disk, currentPath)}>`,
    [disk, currentPath]
  );

  const promptInputValue = useMemo(() => {
    if (selectedEntry?.type === "file") {
      return selectedEntry.name.toLowerCase();
    }
    return "";
  }, [selectedEntry]);

  return { promptText, promptInputValue };
}
