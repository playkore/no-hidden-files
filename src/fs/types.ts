/**
 * Represents a node in the virtual filesystem.
 * Can be either a file or a directory.
 */
export interface FsNode {
  /** Name of the file or directory */
  name: string;
  /** Type of the node: 'file' or 'dir' */
  type: 'file' | 'dir';
  /** Child nodes if this is a directory */
  children?: FsNode[];
}

/**
 * Represents the root filesystem structure.
 */
export type FileSystem = FsNode;

/**
 * Represents a filesystem path as an array of directory names.
 * Example: ['games', 'doom'] represents /games/doom
 */
export type FsPath = string[];
