import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import type { ReactNode } from 'react'
import { Provider } from 'jotai'
import { useFileSystem } from './useFileSystem'

const wrapper = ({ children }: { children: ReactNode }) => <Provider>{children}</Provider>

describe('useFileSystem', () => {
  it('exposes root entries and initial state', () => {
    const { result } = renderHook(() => useFileSystem(), {
      wrapper,
    })

    expect(result.current.currentPath).toEqual([])
    const names = result.current.entries.map((entry) => entry.name)
    expect(names).toEqual(['games', 'docs', 'readme.txt'])
    expect(result.current.selectedIndex).toBe(0)
  })

  it('navigates into and out of directories', () => {
    const { result } = renderHook(() => useFileSystem(), {
      wrapper,
    })

    act(() => {
      result.current.enterDirectory('games')
    })
    expect(result.current.currentPath).toEqual(['games'])
    expect(result.current.entries.some((entry) => entry.name === 'doom')).toBe(true)

    act(() => {
      result.current.goToParent()
    })
    expect(result.current.currentPath).toEqual([])
  })

  it('resets selection when navigating and allows manual selection changes', () => {
    const { result } = renderHook(() => useFileSystem(), {
      wrapper,
    })

    act(() => result.current.setSelectedIndex(2))
    expect(result.current.selectedIndex).toBe(2)

    act(() => result.current.enterDirectory('docs'))
    expect(result.current.selectedIndex).toBe(0)

    act(() => result.current.goToParent())
    expect(result.current.selectedIndex).toBe(1)
  })
})
