import React from 'react'
import { atom, useAtom } from 'jotai'

const titleAtom = atom('There are no hidden files')

export default function App() {
  const [title] = useAtom(titleAtom)

  return (
    <div className="app">
      <main>
        <h1>{title}</h1>
        <p>This is a placeholder page for the game.</p>
      </main>
    </div>
  )
}
