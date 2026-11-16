import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { api } = vi.hoisted(() => ({ api: { get: vi.fn(() => Promise.resolve({})) } }))
vi.mock('../../hooks/useApi', () => ({ useApi: () => api }))
vi.mock('../../hooks/useFeatureFlags', () => ({
  useFeatureFlags: () => ({ isPro: false, hasFeature: () => false }),
}))
vi.mock('../../hooks/useActivityTokenRefresh', () => ({ default: () => {} }))
vi.mock('../../utils/version', () => ({ getCurrentVersion: () => Promise.resolve('4.3.2'), getCurrentVersionSync: () => '4.3.2', formatVersion: (v) => v }))
vi.mock('../../config/api', () => ({ API_URL: '' }))

import GaevaTopbar from '../nav/GaevaTopbar'
import AdminLayout from '../AdminLayout'

const Icon = () => <svg aria-hidden="true" />
const groups = [{ items: [
  { path: '/admin/items', label: 'Items', icon: Icon },
  { path: '/admin/production', label: 'Production', icon: Icon },
] }]
const baseProps = {
  groups, user: { first_name: 'Ana', last_name: 'Lima', account_type: 'admin' },
  version: '4.3.2', appearance: 'light', isAdmin: true, isPro: false,
  onToggleAppearance: vi.fn(), onLogout: vi.fn(), onOpenPortalAdmin: vi.fn(),
}
const originalShowModal = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'showModal')
const originalClose = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'close')
function mount(props = {}) {
  return render(<MemoryRouter initialEntries={['/admin']}>
    <GaevaTopbar {...baseProps} {...props} />
    <Routes><Route path="/admin" element={null} /><Route path="/admin/items" element={<p>Catálogo real</p>} /></Routes>
  </MemoryRouter>)
}
beforeEach(() => {
  vi.clearAllMocks()
  localStorage.clear()
  vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: false, status: 404 })))
  // jsdom lacks native dialog APIs. Only emulate the open-state API, not focus,
  // native Escape cancellation, focus trapping or browser rendering behavior.
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', { configurable: true, value() { this.setAttribute('open', '') } })
  Object.defineProperty(HTMLDialogElement.prototype, 'close', { configurable: true, value() { this.removeAttribute('open') } })
})
afterEach(() => {
  cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); localStorage.clear()
  if (originalShowModal) Object.defineProperty(HTMLDialogElement.prototype, 'showModal', originalShowModal)
  else delete HTMLDialogElement.prototype.showModal
  if (originalClose) Object.defineProperty(HTMLDialogElement.prototype, 'close', originalClose)
  else delete HTMLDialogElement.prototype.close
})

describe('GAEVA topbar functions', () => {
  it.each(['Control', 'Meta'])('opens a focused search from %s K and exposes only the permitted module list', async (modifier) => {
    const user = userEvent.setup()
    mount()
    await user.keyboard(`{${modifier}>}k{/${modifier}}`)
    const dialog = screen.getByRole('dialog', { name: 'Buscar páginas' })
    expect(screen.getByRole('textbox', { name: 'Nome da página' })).toHaveFocus()
    expect(within(dialog).getAllByRole('link').map((node) => node.getAttribute('href')))
      .toEqual(['/admin/items', '/admin/production'])
    expect(within(dialog).queryByRole('link', { name: 'Configurações' })).not.toBeInTheDocument()
  })

  it('filters without accents, handles no results and closes with the explicit button', async () => {
    const user = userEvent.setup()
    mount()
    await user.click(screen.getByRole('button', { name: 'Buscar páginas' }))
    const input = screen.getByRole('textbox', { name: 'Nome da página' })
    await user.type(input, 'producao')
    expect(screen.getByRole('link', { name: 'Produção' })).toHaveAttribute('href', '/admin/production')
    expect(screen.queryByRole('link', { name: 'Itens e modelos' })).not.toBeInTheDocument()
    await user.clear(input)
    await user.type(input, 'inexistente')
    expect(screen.getByText('Nenhuma página encontrada.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Fechar busca' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('navigates a search result to the existing module and closes search', async () => {
    const user = userEvent.setup()
    mount()
    await user.click(screen.getByRole('button', { name: 'Buscar páginas' }))
    await user.click(screen.getByRole('link', { name: 'Itens e modelos' }))
    expect(screen.getByText('Catálogo real')).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('uses real account identity and preserves the logout callback', async () => {
    const user = userEvent.setup()
    mount()
    expect(screen.getByText('AL')).toBeInTheDocument()
    const accountButton = screen.getByRole('button', { name: 'Menu da conta' })
    await user.click(accountButton)
    const account = screen.getByRole('region', { name: 'Conta' })
    expect(within(account).getByText('Ana Lima')).toBeInTheDocument()
    expect(within(account).getByText('Administração')).toBeInTheDocument()
    await user.click(within(account).getByRole('button', { name: 'Sair' }))
    expect(baseProps.onLogout).toHaveBeenCalledTimes(1)
  })

  it('keeps settings and portal actions gated for a nonadministrator', async () => {
    const user = userEvent.setup()
    mount({ isAdmin: false, isPro: true, buyerPortalUrl: 'https://shop.example.test', user: { first_name: 'Eva', account_type: 'operator' } })
    await user.click(screen.getByRole('button', { name: 'Menu da conta' }))
    const account = screen.getByRole('region', { name: 'Conta' })
    expect(within(account).getByText('Operação')).toBeInTheDocument()
    expect(within(account).queryByRole('link', { name: 'Configurações' })).not.toBeInTheDocument()
    expect(within(account).queryByRole('button', { name: 'Administração do portal' })).not.toBeInTheDocument()
    expect(within(account).queryByRole('link', { name: 'Portal do comprador' })).not.toBeInTheDocument()
  })

  it('preserves gated existing portal destinations and loading state', async () => {
    const user = userEvent.setup()
    mount({ isPro: true, buyerPortalUrl: 'https://shop.example.test', portalLinkLoading: true })
    await user.click(screen.getByRole('button', { name: 'Menu da conta' }))
    expect(screen.getByRole('button', { name: 'Abrindo…' })).toBeDisabled()
    expect(screen.getByRole('link', { name: 'Configurações' })).toHaveAttribute('href', '/admin/settings')
    const buyer = screen.getByRole('link', { name: 'Portal do comprador' })
    expect(buyer).toHaveAttribute('href', 'https://shop.example.test')
    expect(buyer).toHaveAttribute('target', '_blank')
    expect(buyer).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('reports notification integration honestly and returns focus after Escape', async () => {
    const user = userEvent.setup()
    mount()
    const bell = screen.getByRole('button', { name: 'Notificações' })
    await user.click(bell)
    expect(screen.getByText('A central de notificações ainda não está integrada.')).toBeInTheDocument()
    expect(bell).toHaveAttribute('aria-expanded', 'true')
    await user.keyboard('{Escape}')
    expect(bell).toHaveAttribute('aria-expanded', 'false')
    expect(bell).toHaveFocus()
    expect(screen.queryByText('A central de notificações ainda não está integrada.')).not.toBeInTheDocument()
  })

  it('closes account with Escape and restores its trigger focus', async () => {
    const user = userEvent.setup()
    mount()
    const account = screen.getByRole('button', { name: 'Menu da conta' })
    await user.click(account)
    await user.keyboard('{Escape}')
    expect(account).toHaveAttribute('aria-expanded', 'false')
    expect(account).toHaveFocus()
  })

  it('persists appearance on the shell only and restores the preference on remount', async () => {
    const user = userEvent.setup()
    localStorage.setItem('adminUser', JSON.stringify(baseProps.user))
    const create = () => render(<MemoryRouter><AdminLayout /></MemoryRouter>)
    const view = create()
    const documentClass = document.documentElement.className
    const bodyClass = document.body.className
    await user.click(screen.getByRole('button', { name: 'Usar aparência escura' }))
    expect(view.container.querySelector('.gaeva-shell')).toHaveAttribute('data-appearance', 'dark')
    expect(localStorage.getItem('gaevaAppearance')).toBe('dark')
    expect(document.documentElement.className).toBe(documentClass)
    expect(document.body.className).toBe(bodyClass)
    view.unmount()
    const restored = create()
    expect(restored.container.querySelector('.gaeva-shell')).toHaveAttribute('data-appearance', 'dark')
    await user.click(screen.getByRole('button', { name: 'Usar aparência clara' }))
    expect(localStorage.getItem('gaevaAppearance')).toBe('light')
  })
})
