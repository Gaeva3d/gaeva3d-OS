import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { LocaleProvider, useLocale } from '../LocaleContext'
import { setLocaleDefaults } from '../../lib/number'

// Reset module defaults before each test
beforeEach(() => {
  setLocaleDefaults('USD', 'en-US')
})

afterEach(() => {
  vi.restoreAllMocks()
})

const wrapper = ({ children }) => <LocaleProvider>{children}</LocaleProvider>

describe('LocaleProvider defaults', () => {
  it('provides USD and en-US defaults before settings load', () => {
    // Simulate fetch failing (unauthenticated)
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('not authenticated')))

    const { result } = renderHook(() => useLocale(), { wrapper })
    expect(result.current.currency_code).toBe('USD')
    expect(result.current.locale).toBe('en-US')
  })

  it('provides updateLocaleSettings function', () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('not authenticated')))
    const { result } = renderHook(() => useLocale(), { wrapper })
    expect(typeof result.current.updateLocaleSettings).toBe('function')
  })
})

describe('LocaleProvider with settings fetch', () => {
  it('updates currency and locale after successful fetch', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ currency_code: 'EUR', locale: 'de-DE' }),
    }))

    const { result } = renderHook(() => useLocale(), { wrapper })

    await waitFor(() => {
      expect(result.current.currency_code).toBe('EUR')
    })
    expect(result.current.locale).toBe('de-DE')
  })

  it('keeps defaults when fetch returns non-ok response (401)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))

    const { result } = renderHook(() => useLocale(), { wrapper })

    // Give fetch a chance to resolve
    await act(async () => { await Promise.resolve() })
    expect(result.current.currency_code).toBe('USD')
    expect(result.current.locale).toBe('en-US')
  })

  it('falls back to USD when currency_code is missing from response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ currency_code: null, locale: 'fr-FR' }),
    }))

    const { result } = renderHook(() => useLocale(), { wrapper })

    await waitFor(() => {
      expect(result.current.locale).toBe('fr-FR')
    })
    expect(result.current.currency_code).toBe('USD')
  })
})

describe('updateLocaleSettings', () => {
  it('updates currency_code and locale immediately', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('not authenticated')))

    const { result } = renderHook(() => useLocale(), { wrapper })

    act(() => {
      result.current.updateLocaleSettings({ currency_code: 'CAD', locale: 'en-CA' })
    })

    expect(result.current.currency_code).toBe('CAD')
    expect(result.current.locale).toBe('en-CA')
  })

  it('does a partial update — only provided keys change', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('not authenticated')))

    const { result } = renderHook(() => useLocale(), { wrapper })

    act(() => {
      result.current.updateLocaleSettings({ locale: 'fr-CA' })
    })

    expect(result.current.locale).toBe('fr-CA')
    expect(result.current.currency_code).toBe('USD') // unchanged
  })
})
