import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
    expect(screen.getByText('Left')).toBeInTheDocument()
    expect(screen.getByText('Right')).toBeInTheDocument()
  })

  it('displays the file panel with initial path', () => {
    render(<App />)
    expect(screen.getByText('C:\\')).toBeInTheDocument()
  })

  it('shows parent directory (..) as first entry', () => {
    render(<App />)
    expect(screen.getByText(/\.\./)).toBeInTheDocument()
  })
})
