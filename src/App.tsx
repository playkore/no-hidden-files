import { useEffect } from 'react'
import { RetroScreen } from './components/RetroScreen'
import FilePanel from './components/FilePanel'
import { useFileSystem } from './hooks/useFileSystem'

export default function App() {
  const { entries, selectedIndex, setSelectedIndex } = useFileSystem()

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowDown') {
        setSelectedIndex((i) => Math.min(i + 1, entries.length - 1))
      } else if (e.key === 'ArrowUp') {
        setSelectedIndex((i) => Math.max(i - 1, 0))
      } else if (e.key === 'Enter') {
        const el = entries[selectedIndex]
        // simulate click by dispatching a custom event that FilePanel could listen for
        // simpler: rely on default click handler by focusing and pressing enter isn't implemented yet
        // just log for now
        console.log('Enter pressed on', el?.name)
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [entries, selectedIndex, setSelectedIndex])

  return (
    <div className="app">
      <RetroScreen>
        <FilePanel />
      </RetroScreen>
    </div>
  )
}
