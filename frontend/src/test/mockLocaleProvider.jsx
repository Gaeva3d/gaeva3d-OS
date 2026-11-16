/**
 * MockLocaleProvider — test helper for component currency tests.
 *
 * Provides a specific currency_code and locale directly via context,
 * bypassing the async /settings/company fetch. Use this in component tests
 * that need to verify "component shows € instead of $ when currency is EUR."
 *
 * Usage:
 *   render(
 *     <MockLocaleProvider currency="EUR" locale="en-US">
 *       <MyComponent />
 *     </MockLocaleProvider>
 *   )
 */
import LocaleContext from '../contexts/LocaleContext'

export function MockLocaleProvider({ currency = 'USD', locale = 'en-US', children }) {
  return (
    <LocaleContext.Provider value={{ currency_code: currency, locale, updateLocaleSettings: () => {} }}>
      {children}
    </LocaleContext.Provider>
  )
}
