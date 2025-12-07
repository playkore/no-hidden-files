import { useAtom } from 'jotai'
import { entriesAtom, currentPathAtom, selectedIndexAtom } from '../state/atoms'
import type { FsNode } from '../fs/types'

function padRight(s: string, w: number): string {
  const str = String(s)
  if (str.length >= w) return str.slice(0, w)
  return str + ' '.repeat(w - str.length)
}

export default function FilePanel() {
  const [entries] = useAtom(entriesAtom)
  const [currentPath, setCurrentPath] = useAtom(currentPathAtom)
  const [selectedIndex, setSelectedIndex] = useAtom(selectedIndexAtom)

  const pathStr = '/' + currentPath.join('/')

  function openEntry(entry: FsNode) {
    if (entry.name === '..') {
      setCurrentPath((p) => p.slice(0, -1))
      setSelectedIndex(0)
    } else if (entry.type === 'dir') {
      setCurrentPath((p) => [...p, entry.name])
      setSelectedIndex(0)
    } else {
      // file opened - for scaffold just alert
      alert(`Open file: ${entry.name}`)
    }
  }

  return (
    <div className="file-panel">
      <div className="panel-header">PATH: {pathStr}</div>
      <div className="panel-sep">────────────────────────────────────────────</div>
      <div className="list">
        {entries.map((e, i) => {
          const isSel = i === selectedIndex
          return (
            <div
              key={i}
              className={isSel ? 'row selected' : 'row'}
              onClick={() => {
                setSelectedIndex(i)
                openEntry(e)
              }}
            >
              <span className="cursor">{isSel ? '>' : ' '}</span>
              <span className="name">{padRight(e.name + (e.type === 'dir' && e.name !== '..' ? '/' : ''), 30)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
