import type { ReactNode } from 'react'
import styles from './RetroScreen.module.css'

interface RetroScreenProps {
  children: ReactNode
}

export function RetroScreen({ children }: RetroScreenProps) {
  return (
    <div className={styles.retroScreen}>
      <pre className={styles.screen}>{children}</pre>
    </div>
  )
}
