import type { ReactNode } from 'react'

interface RetroScreenProps {
  children: ReactNode
}

export function RetroScreen({ children }: RetroScreenProps) {
  return (
    <div className="retro-screen">
      <pre className="screen">{children}</pre>
    </div>
  )
}
