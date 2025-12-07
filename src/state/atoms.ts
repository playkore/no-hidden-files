import { atom } from 'jotai'
import { sampleFs } from '../fs/sampleFs'
import type { FileSystem, FsNode, FsPath } from '../fs/types'

export const fsAtom = atom<FileSystem>(sampleFs)

export const currentPathAtom = atom<FsPath>([])

export const selectedIndexAtom = atom<number>(0)

export const entriesAtom = atom<FsNode[]>((get) => {
  const fs = get(fsAtom)
  const path = get(currentPathAtom)

  let node: FsNode = fs
  for (const p of path) {
    const found = (node.children ?? []).find((c) => c.name === p)
    if (!found) break
    node = found
  }

  const items = node.children ?? []
  return [{ name: '..', type: 'dir' }, ...items]
})
