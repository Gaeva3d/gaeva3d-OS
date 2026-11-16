/**
 * Integration test: BOMCostRollupCard respects company currency setting.
 *
 * Tests the ACTUAL USER-FACING REQUIREMENT:
 * when currency is set to EUR, the component renders € not $.
 */
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import BOMCostRollupCard from '../BOMCostRollupCard'
import { MockLocaleProvider } from '../../../test/mockLocaleProvider'

const costRollup = {
  has_sub_assemblies: true,
  sub_assembly_count: 2,
  direct_cost: 10.50,
  sub_assembly_cost: 34.25,
  rolled_up_cost: 44.75,
}

const renderWith = (currency, locale = 'en-US') =>
  render(
    <MockLocaleProvider currency={currency} locale={locale}>
      <BOMCostRollupCard costRollup={costRollup} />
    </MockLocaleProvider>
  )

describe('BOMCostRollupCard — currency display', () => {
  it('shows USD by default', () => {
    renderWith('USD')
    expect(screen.getByText('$10.50')).toBeInTheDocument()
    expect(screen.getByText('$34.25')).toBeInTheDocument()
    expect(screen.getByText('$44.75')).toBeInTheDocument()
  })

  it('shows € when currency is EUR', () => {
    renderWith('EUR')
    expect(screen.getByText('€10.50')).toBeInTheDocument()
    expect(screen.getByText('€44.75')).toBeInTheDocument()
    expect(screen.queryByText('$10.50')).not.toBeInTheDocument()
  })

  it('shows £ when currency is GBP', () => {
    renderWith('GBP')
    expect(screen.getByText('£44.75')).toBeInTheDocument()
    expect(screen.queryByText('$44.75')).not.toBeInTheDocument()
  })

  it('returns null when costRollup has no sub-assemblies', () => {
    const { container } = render(
      <MockLocaleProvider currency="USD">
        <BOMCostRollupCard costRollup={{ has_sub_assemblies: false }} />
      </MockLocaleProvider>
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders zero costs without crashing', () => {
    const zeroCost = {
      has_sub_assemblies: true,
      sub_assembly_count: 1,
      direct_cost: 0,
      sub_assembly_cost: 0,
      rolled_up_cost: 0,
    }
    render(
      <MockLocaleProvider currency="USD">
        <BOMCostRollupCard costRollup={zeroCost} />
      </MockLocaleProvider>
    )
    expect(screen.getAllByText('$0.00').length).toBeGreaterThan(0)
  })
})
