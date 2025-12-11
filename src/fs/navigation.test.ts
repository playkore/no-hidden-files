import { describe, expect, it } from "vitest";
import type { FileSystem } from "./types";
import {
  getSelectionIndexForPathChange,
  resolveEntries,
} from "./navigation";

const mockFs: FileSystem = {
  name: "C",
  type: "dir",
  children: [
    {
      name: "games",
      type: "dir",
      children: [
        { name: "qbert", type: "dir", children: [] },
        { name: "doom", type: "dir", children: [] },
      ],
    },
    {
      name: "docs",
      type: "dir",
      children: [{ name: "notes.txt", type: "file", size: 10 }],
    },
  ],
};

describe("filesystem navigation helpers", () => {
  it("resolves entries with parent directory prepended", () => {
    const entries = resolveEntries(mockFs, ["games"]);
    expect(entries.map((entry) => entry.name)).toEqual([
      "..",
      "qbert",
      "doom",
    ]);
  });

  it("omits '..' at the root directory", () => {
    const entries = resolveEntries(mockFs, []);
    expect(entries.map((entry) => entry.name)).toEqual(["games", "docs"]);
  });

  it("selects '..' when entering a subdirectory", () => {
    const currentPath: string[] = ["games"];
    const nextPath: string[] = ["games", "qbert"];
    const selection = getSelectionIndexForPathChange(
      mockFs,
      currentPath,
      nextPath
    );
    expect(selection).toBe(0);
  });

  it("selects the directory we came from when returning to a parent", () => {
    const previousPath: string[] = ["games", "qbert"];
    const nextPath: string[] = ["games"];
    const selection = getSelectionIndexForPathChange(
      mockFs,
      previousPath,
      nextPath
    );
    expect(selection).toBe(1); // '..' is index 0, 'qbert' becomes selected
  });

  it("falls back to index 0 when the origin directory is missing", () => {
    const currentPath: string[] = ["docs", "missing"];
    const nextPath: string[] = ["docs"];
    const selection = getSelectionIndexForPathChange(
      mockFs,
      currentPath,
      nextPath
    );
    expect(selection).toBe(0);
  });
});
