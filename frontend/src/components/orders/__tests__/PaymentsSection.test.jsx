/**
 * Integration test: PaymentsSection shows correct currency to users.
 */
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import PaymentsSection from '../PaymentsSection'
import { MockLocaleProvider } from '../../../test/mockLocaleProvider'

const paymentSummary = {
  order_total: 150.00,
  total_paid: 100.00,
  total_refunded: 0,
  balance_due: 50.00,
}

const renderWith = (currency, locale = 'en-US') =>
  render(
    <MockLocaleProvider currency={currency} locale={locale}>
      <PaymentsSection
        payments={[]}
        paymentSummary={paymentSummary}
        onRecordPayment={() => {}}
        onRefund={() => {}}
      />
    </MockLocaleProvider>
  )

describe('PaymentsSection — currency display', () => {
  it('shows $ amounts with USD', () => {
    renderWith('USD')
    expect(screen.getByText('$150.00')).toBeInTheDocument()
    expect(screen.getByText('$100.00')).toBeInTheDocument()
    expect(screen.getByText('$50.00')).toBeInTheDocument()
  })

  it('shows € instead of $ when currency is EUR', () => {
    renderWith('EUR')
    expect(screen.getByText('€150.00')).toBeInTheDocument()
    expect(screen.queryByText('$150.00')).not.toBeInTheDocument()
  })

  it('shows £ instead of $ when currency is GBP', () => {
    renderWith('GBP')
    expect(screen.getByText('£150.00')).toBeInTheDocument()
    expect(screen.queryByText('$150.00')).not.toBeInTheDocument()
  })
})
