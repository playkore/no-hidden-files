import React from 'react'

export function RetroScreen({ children }) {
  return (
    <div className="retro-screen">
      <pre className="screen">{children}</pre>
    </div>
  )
}
