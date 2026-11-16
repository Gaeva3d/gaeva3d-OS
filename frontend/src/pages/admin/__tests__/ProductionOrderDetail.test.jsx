import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mocks } = vi.hoisted(() => {
  const mocks = {
    get: vi.fn(),
    post: vi.fn(),
    toastError: vi.fn(),
    toastSuccess: vi.fn(),
  }
  mocks.api = {
    get: mocks.get,
    post: mocks.post,
  }
  mocks.toast = {
    error: mocks.toastError,
    success: mocks.toastSuccess,
  }
  return { mocks }
})

vi.mock('../../../hooks/useApi', () => ({
  useApi: () => mocks.api,
}))

vi.mock('../../../components/Toast', () => ({
  useToast: () => mocks.toast,
}))

vi.mock('../../../components/orders/BlockingIssuesPanel', () => ({
  default: () => <div>Blocking issues</div>,
}))

vi.mock('../../../components/production', () => ({
  OperationsPanel: () => <div>Operations panel</div>,
  OperationSchedulerModal: () => null,
  OperationsTimeline: () => <div>Operations timeline</div>,
}))

// Mock ReleaseScheduleWizard so we can check it opens on release and that
// the page wires a working onClose (dismiss path).
vi.mock('../../../components/production/ReleaseScheduleWizard', () => ({
  default: (props) => {
    if (!props.isOpen) return null
    return (
      <div data-testid="release-wizard">
        Wizard open for {props.productionOrder?.code}
        <button onClick={props.onClose}>Dismiss wizard</button>
      </div>
    )
  },
}))

import ProductionOrderDetail from '../ProductionOrderDetail'

const draftOrder = {
  id: 2782,
  code: 'PO-2026-0024',
  status: 'draft',
  product_name: 'Raspberry Pi 5 Enclosure',
  product_sku: 'FG-ENCLOSURE-01',
  quantity_ordered: 1,
  quantity_completed: 0,
  priority: 3,
  due_date: null,
  sales_order_id: 2789,
  sales_order_code: 'SO-2026-054',
  customer_name: 'Walk-in Customer',
}

let currentOrder = draftOrder

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/admin/production/2782']}>
      <Routes>
        <Route path="/admin/production/:orderId" element={<ProductionOrderDetail />} />
      </Routes>
    </MemoryRouter>,
  )
}

beforeEach(() => {
  currentOrder = draftOrder
  mocks.get.mockReset()
  mocks.post.mockReset()
  mocks.toastError.mockReset()
  mocks.toastSuccess.mockReset()
  mocks.get.mockImplementation((path) => {
    if (path === '/api/v1/production-orders/2782') {
      return Promise.resolve(currentOrder)
    }
    if (path === '/api/v1/production-orders/2782/operations') {
      return Promise.resolve([])
    }
    return Promise.reject(new Error(`unexpected path ${path}`))
  })
  mocks.post.mockResolvedValue({})
})

describe('ProductionOrderDetail', () => {
  it('renders production workflow and linked sales order context', async () => {
    renderPage()

    expect(await screen.findByRole('heading', { name: 'Fluxo de produção' })).toBeInTheDocument()
    expect(screen.getByText('Aguardando liberação')).toBeInTheDocument()
    expect(screen.getAllByText('SO-2026-054')).toHaveLength(2)
    expect(screen.getByRole('heading', { name: 'Ordem de produção: PO-2026-0024' })).toBeInTheDocument()
    expect(screen.getByText(draftOrder.product_name)).toBeInTheDocument()
    expect(screen.getByText(/gerenciar a fatura, os pagamentos e o envio/i)).toBeInTheDocument()
  })

  it('localizes the generated order note and preserves the free-form note', async () => {
    currentOrder = {
      ...draftOrder,
      notes: 'Auto-generated from SO-2026-054 Line 2\nCheck the filament color.',
    }

    renderPage()

    expect(await screen.findByText(
      'Gerada a partir do item 2 do pedido SO-2026-054 Check the filament color.',
    )).toBeInTheDocument()
  })

  it('shows draft orders as not released with a release action', async () => {
    renderPage()

    expect(await screen.findByText('Aguardando liberação')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Liberar para produção' })).toHaveLength(2)
  })

  it('shows released orders as ready to start', async () => {
    currentOrder = { ...draftOrder, status: 'released' }

    renderPage()

    expect(await screen.findByText('Pronta para iniciar')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Iniciar produção' })).toHaveLength(2)
  })

  it('shows active orders as ready to complete', async () => {
    currentOrder = { ...draftOrder, status: 'in_progress' }

    renderPage()

    expect(await screen.findByText('Pronta para concluir')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Concluir produção' })).toHaveLength(2)
  })

  it('localizes the loading state and formats the due date as a Brazilian calendar date', async () => {
    currentOrder = { ...draftOrder, due_date: '2026-12-03' }

    renderPage()

    expect(screen.getByRole('status')).toHaveTextContent('Carregando ordem de produção')
    expect(await screen.findByText('03/12/2026')).toBeInTheDocument()
  })

  it('localizes a denied request and the way back to production', async () => {
    mocks.get.mockRejectedValueOnce(Object.assign(new Error('Access denied'), { status: 403 }))

    renderPage()

    expect(await screen.findByRole('alert')).toHaveTextContent('Você não tem permissão para realizar esta ação.')
    expect(screen.getByRole('button', { name: 'Voltar à produção' })).toBeInTheDocument()
  })

  it('localizes a release rejection while retaining the shortage details', async () => {
    mocks.post.mockRejectedValueOnce(Object.assign(new Error('Insufficient stock'), {
      status: 400,
      payload: {
        detail: {
          shortages: [{ component_sku: 'MAT-01', needed: 2.5, reserved: 1 }],
        },
      },
    }))

    renderPage()

    const [releaseButton] = await screen.findAllByRole('button', { name: 'Liberar para produção' })
    fireEvent.click(releaseButton)

    await waitFor(() => {
      expect(mocks.toastError).toHaveBeenCalledWith(
        'Há materiais pendentes para liberar a ordem. MAT-01: necessário 2,5, reservado 1.',
      )
    })
    expect(screen.queryByTestId('release-wizard')).not.toBeInTheDocument()
  })

  it('calls the release endpoint from the workflow action', async () => {
    renderPage()

    const [, workflowReleaseButton] = await screen.findAllByRole('button', {
      name: 'Liberar para produção',
    })
    fireEvent.click(workflowReleaseButton)

    await waitFor(() => {
      expect(mocks.post).toHaveBeenCalledWith('/api/v1/production-orders/2782/release')
      expect(mocks.toastSuccess).toHaveBeenCalledWith('Ordem liberada para produção.')
    })
  })

  it('opens the release wizard after a successful release', async () => {
    renderPage()

    const releaseButtons = await screen.findAllByRole('button', {
      name: 'Liberar para produção',
    })
    fireEvent.click(releaseButtons[0])

    await waitFor(() => {
      expect(screen.getByTestId('release-wizard')).toBeInTheDocument()
    })
  })

  it('release wizard is dismissible without affecting the released order', async () => {
    renderPage()

    const releaseButtons = await screen.findAllByRole('button', {
      name: 'Liberar para produção',
    })
    fireEvent.click(releaseButtons[0])

    // Wizard appears
    await waitFor(() => {
      expect(screen.getByTestId('release-wizard')).toBeInTheDocument()
    })

    // Dismiss it — the wizard must unmount and the release must stand
    fireEvent.click(screen.getByRole('button', { name: /dismiss wizard/i }))
    await waitFor(() => {
      expect(screen.queryByTestId('release-wizard')).not.toBeInTheDocument()
    })

    // The post was still called (release happened regardless of wizard)
    expect(mocks.post).toHaveBeenCalledWith('/api/v1/production-orders/2782/release')
  })
})
