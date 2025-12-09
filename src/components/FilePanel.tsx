import { useFileSystem } from '../hooks/useFileSystem'
import type { FsNode } from '../fs/types'

function padRight(s: string, w: number): string {
  const str = String(s)
  if (str.length >= w) return str.slice(0, w)
  return str + ' '.repeat(w - str.length)
}

export default function FilePanel() {
  const { entries, currentPath, selectedIndex, setSelectedIndex, goToParent, enterDirectory } = useFileSystem()

  const pathStr = '/' + currentPath.join('/')

  function openEntry(entry: FsNode) {
    if (entry.name === '..') {
      goToParent()
    } else if (entry.type === 'dir') {
      enterDirectory(entry.name)
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
