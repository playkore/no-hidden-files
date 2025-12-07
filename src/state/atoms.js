import { atom } from 'jotai'
import { sampleFs } from '../fs/sampleFs'

export const fsAtom = atom(sampleFs)

export const currentPathAtom = atom([])

export const selectedIndexAtom = atom(0)

export const entriesAtom = atom((get) => {
  const fs = get(fsAtom)
  const path = get(currentPathAtom)

  let node = fs
  for (const p of path) {
    const found = (node.children || []).find((c) => c.name === p)
    if (!found) break
    node = found
  }

  const items = node.children ?? []
  return [{ name: '..', type: 'dir' }, ...items]
})
