import { renderHook } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { useFormatCurrency } from '../useFormatCurrency'
import { LocaleProvider } from '../../contexts/LocaleContext'
import { setLocaleDefaults } from '../../lib/number'

// Reset module-level defaults before each test
beforeEach(() => {
  setLocaleDefaults('USD', 'en-US')
})

const wrapper = ({ children }) => <LocaleProvider>{children}</LocaleProvider>

describe('useFormatCurrency', () => {
  it('returns a function', () => {
    const { result } = renderHook(() => useFormatCurrency(), { wrapper })
    expect(typeof result.current).toBe('function')
  })

  it('formats a number as USD by default', () => {
    const { result } = renderHook(() => useFormatCurrency(), { wrapper })
    expect(result.current(1234.56)).toBe('$1,234.56')
  })

  it('returns empty string for null', () => {
    const { result } = renderHook(() => useFormatCurrency(), { wrapper })
    expect(result.current(null)).toBe('')
  })

  it('returns empty string for undefined', () => {
    const { result } = renderHook(() => useFormatCurrency(), { wrapper })
    expect(result.current(undefined)).toBe('')
  })

  it('returns empty string for NaN', () => {
    const { result } = renderHook(() => useFormatCurrency(), { wrapper })
    expect(result.current(NaN)).toBe('')
  })

  it('formats zero as $0.00', () => {
    const { result } = renderHook(() => useFormatCurrency(), { wrapper })
    expect(result.current(0)).toBe('$0.00')
  })

  it('handles string numbers', () => {
    const { result } = renderHook(() => useFormatCurrency(), { wrapper })
    // "100" coerces to number 100
    expect(result.current('100')).toBe('$100.00')
  })
})
