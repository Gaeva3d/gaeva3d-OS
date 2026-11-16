/**
 * Integration test: WorkCenterCard shows rate per hour in company currency.
 */
import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import WorkCenterCard from '../WorkCenterCard'
import { MockLocaleProvider } from '../../../test/mockLocaleProvider'

// WorkCenterCard uses useToast and fetch — stub both
vi.mock('../../Toast', () => ({
  useToast: () => ({ success: vi.fn(), error: vi.fn(), warning: vi.fn() }),
}))

const workCenter = {
  id: 1,
  name: 'CNC Router',
  type: 'machine',
  status: 'active',
  total_rate_per_hour: 75.00,
  description: 'Main router',
}

const renderWith = (currency, locale = 'en-US') =>
  render(
    <MockLocaleProvider currency={currency} locale={locale}>
      <WorkCenterCard
        workCenter={workCenter}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onAddResource={vi.fn()}
        onEditResource={vi.fn()}
        onDeleteResource={vi.fn()}
      />
    </MockLocaleProvider>
  )

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))
})

describe('WorkCenterCard — hourly rate currency', () => {
  it('shows $75.00/hr with USD', () => {
    renderWith('USD')
    expect(screen.getByText(/\$75\.00\/hr/)).toBeInTheDocument()
  })

  it('shows £75.00/hr with GBP — user sees correct symbol', () => {
    renderWith('GBP')
    expect(screen.getByText(/£75\.00\/hr/)).toBeInTheDocument()
    expect(screen.queryByText(/\$75\.00\/hr/)).not.toBeInTheDocument()
  })

  it('shows €75.00/hr with EUR — user sees correct symbol', () => {
    renderWith('EUR')
    expect(screen.getByText(/€75\.00\/hr/)).toBeInTheDocument()
    expect(screen.queryByText(/\$75\.00\/hr/)).not.toBeInTheDocument()
  })
})
