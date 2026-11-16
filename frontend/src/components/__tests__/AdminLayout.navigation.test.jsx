import { act, render, screen, within, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'

const { state } = vi.hoisted(() => ({ state: { isPro: false } }))
const api = { get: () => Promise.resolve({}), post: vi.fn() }
vi.mock('../../hooks/useApi', () => ({ useApi: () => api }))
vi.mock('../../hooks/useFeatureFlags', () => ({
  useFeatureFlags: () => ({ isPro: state.isPro, hasFeature: () => state.isPro }),
}))
vi.mock('../../hooks/useActivityTokenRefresh', () => ({ default: () => {} }))
vi.mock('../../utils/version', () => ({
  getCurrentVersion: () => Promise.resolve('4.3.2'),
  getCurrentVersionSync: () => '4.3.2', formatVersion: (v) => v,
}))
vi.mock('../../config/api', () => ({ API_URL: '' }))

import AdminLayout from '../AdminLayout'
import { navGroups } from '../nav/navConfig'

const allPaths = navGroups.flatMap((group) => group.items.map((item) => item.path))
const pathsIn = (node) => within(node).getAllByRole('link')
  .map((link) => link.getAttribute('href')).filter((path) => allPaths.includes(path))

function mount(accountType = 'admin') {
  localStorage.setItem('adminUser', JSON.stringify({
    first_name: 'Teste', last_name: 'Navegação', account_type: accountType,
  }))
  return render(<MemoryRouter initialEntries={['/admin']}>
    <Routes><Route path="/admin" element={<AdminLayout />}>
      <Route index element={<p>Conteúdo do módulo</p>} />
      <Route path="items" element={<p>Catálogo existente</p>} />
    </Route></Routes>
  </MemoryRouter>)
}

beforeEach(() => {
  state.isPro = false
  localStorage.clear()
  vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({
    ok: false, status: 404, json: () => Promise.resolve({}),
  })))
})
afterEach(() => { cleanup(); localStorage.clear(); vi.unstubAllGlobals() })

describe('GAEVA shell preserves existing module navigation', () => {
  it('retains every existing module destination for an administrator on PRO', () => {
    state.isPro = true
    mount()
    expect(pathsIn(screen.getByRole('navigation'))).toEqual(allPaths)
    expect(screen.getByText('Conteúdo do módulo')).toBeInTheDocument()
  })

  it('keeps PRO-only destinations hidden on Community', () => {
    mount()
    const expected = navGroups.filter((group) => !group.proOnly)
      .flatMap((group) => group.items.filter((item) => !item.proOnly).map((item) => item.path))
    expect(pathsIn(screen.getByRole('navigation'))).toEqual(expected)
  })

  it('preserves administrator-only restrictions for a nonadministrator', () => {
    mount('operator')
    const expected = navGroups.filter((group) => !group.adminOnly && !group.proOnly)
      .flatMap((group) => group.items.filter((item) => !item.adminOnly && !item.proOnly).map((item) => item.path))
    expect(pathsIn(screen.getByRole('navigation'))).toEqual(expected)
  })

  it('collapses and expands without removing any destination and persists the choice', async () => {
    const user = userEvent.setup()
    mount()
    const original = pathsIn(screen.getByRole('navigation'))
    await user.click(screen.getByRole('button', { name: 'Recolher menu' }))
    expect(localStorage.getItem('sidebarOpen')).toBe('false')
    expect(pathsIn(screen.getByRole('navigation'))).toEqual(original)
    await user.click(screen.getByRole('button', { name: 'Expandir menu' }))
    expect(localStorage.getItem('sidebarOpen')).toBe('true')
    expect(pathsIn(screen.getByRole('navigation'))).toEqual(original)
  })

  it('opens the mobile menu, navigates to the real existing module and closes the drawer', async () => {
    const user = userEvent.setup()
    mount()
    await user.click(screen.getByRole('button', { name: 'Abrir menu de navegação' }))
    expect(screen.getByRole('button', { name: 'Fechar menu de navegação' })).toHaveFocus()
    const mobile = screen.getAllByRole('navigation')[0]
    const link = within(mobile).getAllByRole('link').find((node) => node.getAttribute('href') === '/admin/items')
    await user.click(link)
    expect(screen.queryByRole('button', { name: 'Fechar menu de navegação' })).not.toBeInTheDocument()
    expect(screen.getByText('Catálogo existente')).toBeInTheDocument()
  })
  it('closes mobile navigation on Escape and returns focus to its trigger', async () => {
    const user = userEvent.setup(); mount();
    await user.click(screen.getByRole('button', { name: 'Abrir menu de navegação' }));
    expect(screen.getByRole('dialog', { name: 'Menu de navegação' })).toHaveAttribute('aria-modal', 'true');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: 'Menu de navegação' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Abrir menu de navegação' })).toHaveFocus();
  })
  it('cycles Tab and Shift+Tab within mobile drawer and makes the workspace inert', async () => {
    const user = userEvent.setup(); mount();
    await user.click(screen.getByRole('button', { name: 'Abrir menu de navegação' }));
    const dialog = screen.getByRole('dialog', { name: 'Menu de navegação' });
    const controls = [...dialog.querySelectorAll('a[href],button')];
    controls.at(-1).focus(); await user.tab(); expect(controls[0]).toHaveFocus();
    await user.tab({ shift: true }); expect(controls.at(-1)).toHaveFocus();
    for (let i = 0; i < 32; i++) { await user.tab(); expect(dialog.contains(document.activeElement)).toBe(true); }
    expect(document.querySelector('.gaeva-workspace')).toHaveAttribute('inert');
    await user.keyboard('{Escape}'); expect(document.querySelector('.gaeva-workspace')).not.toHaveAttribute('inert');
  })
  it('releases mobile focus containment when resizing into desktop navigation', async () => {
    let resize;
    vi.stubGlobal('matchMedia', () => ({ addEventListener: (_, callback) => { resize = callback; }, removeEventListener: vi.fn() }));
    const user = userEvent.setup(); mount(); await user.click(screen.getByRole('button', { name: 'Abrir menu de navegação' }));
    await act(async () => resize({ matches: true }));
    expect(screen.queryByRole('dialog', { name: 'Menu de navegação' })).not.toBeInTheDocument();
    expect(document.querySelector('.gaeva-workspace')).not.toHaveAttribute('inert');
  })
})
