import type { ExecutableId } from "../executables/registry";

/**
 * Represents a node in the virtual filesystem.
 * Can be either a file or a directory.
 */

export interface FsNode {
  /** Name of the file or directory */
  name: string;
  /** Type of the node: 'file' or 'dir' */
  type: 'file' | 'dir';
  /** File size in bytes (directories may omit this) */
  size?: number;
  /** ISO-like date string used for display */
  date?: string;
  /** Child nodes if this is a directory */
  children?: FsNode[];
  /** Identifier for executable component to launch when activated */
  executableId?: ExecutableId;
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
