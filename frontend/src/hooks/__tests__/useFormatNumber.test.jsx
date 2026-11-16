import { renderHook } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { useFormatNumber } from '../useFormatNumber'
import { LocaleProvider } from '../../contexts/LocaleContext'
import { setLocaleDefaults } from '../../lib/number'

beforeEach(() => {
  setLocaleDefaults('USD', 'en-US')
})

const wrapper = ({ children }) => <LocaleProvider>{children}</LocaleProvider>

describe('useFormatNumber', () => {
  it('returns a function', () => {
    const { result } = renderHook(() => useFormatNumber(), { wrapper })
    expect(typeof result.current).toBe('function')
  })

  it('formats a number with default options (en-US)', () => {
    const { result } = renderHook(() => useFormatNumber(), { wrapper })
    expect(result.current(1234.56)).toBe('1,234.56')
  })

  it('returns empty string for null', () => {
    const { result } = renderHook(() => useFormatNumber(), { wrapper })
    expect(result.current(null)).toBe('')
  })

  it('formats as percent with options', () => {
    const { result } = renderHook(() => useFormatNumber(), { wrapper })
    // Intl percent format: 0.875 * 100 = 87.5 — default maximumFractionDigits for percent
    // is 0 in some environments, so assert it contains 87 or 88.
    const pct = result.current(0.875, { style: 'percent', maximumFractionDigits: 1 })
    expect(pct).toContain('87.5')
  })

  it('respects maximumFractionDigits option', () => {
    const { result } = renderHook(() => useFormatNumber(), { wrapper })
    expect(result.current(1234, { maximumFractionDigits: 0 })).toBe('1,234')
  })
})
