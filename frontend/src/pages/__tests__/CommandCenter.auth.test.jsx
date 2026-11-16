import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../config/api', () => ({ API_URL: '' }));
vi.mock('../../components/Toast', () => ({ useToast: () => ({ success: vi.fn() }) }));
vi.mock('../../components/command-center/SummaryCard', () => ({
  default: ({ label, value }) => <div>{label}: {value}</div>,
}));
vi.mock('../../components/command-center/MachineStatusGrid', () => ({
  default: ({ suggestions }) => <div data-testid="suggestions">{JSON.stringify(suggestions)}</div>,
}));
vi.mock('../../components/command-center/NextActionLane', () => ({ default: () => null }));
vi.mock('../../components/production/OperationSchedulerModal', () => ({ default: () => null }));
vi.mock('../../components/command-center/DispatchChip', () => ({
  canAutoDispatch: () => false,
  confirmDispatch: vi.fn(),
}));

import CommandCenter from '../CommandCenter';

const summary = { orders_due_today: 17, orders_shipped_today: 3, production_in_progress: 8 };
const suggestion = { printer: { id: 77 }, top_suggestion: { production_order_code: 'QA-401' } };
const payloads = {
  '/api/v1/command-center/action-items': { items: [], counts_by_type: {} },
  '/api/v1/command-center/summary': summary,
  '/api/v1/command-center/resources': { resources: [], summary: {} },
  '/api/v1/settings/company': { auto_dispatch: false },
  '/api/v1/dispatch/suggestions': { results: [suggestion] },
};
const response = (status, payload) => ({
  ok: status >= 200 && status < 300,
  status,
  headers: { get: () => 'application/json' },
  json: async () => payload,
  text: async () => JSON.stringify(payload),
});
const callsFor = (path) => fetch.mock.calls.filter(([url]) => url === path);
const mount = () => render(<MemoryRouter><CommandCenter /></MemoryRouter>);

beforeEach(() => {
  localStorage.setItem('adminUser', JSON.stringify({ account_type: 'admin' }));
});
afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('CommandCenter integra leituras auxiliares ao cliente autenticado', () => {
  it.each([
    ['/api/v1/settings/company', 'configurações'],
    ['/api/v1/dispatch/suggestions', 'sugestões'],
  ])('recupera 401 de %s e preserva o payload recebido (%s)', async (protectedPath) => {
    let renewed = false;
    vi.stubGlobal('fetch', vi.fn(async (url, init) => {
      expect(init.credentials).toBe('include');
      if (url === '/api/v1/auth/refresh') {
        expect(init.method).toBe('POST');
        renewed = true;
        return response(200, {});
      }
      if (url === protectedPath && !renewed) return response(401, {});
      return response(200, payloads[url]);
    }));
    mount();
    await waitFor(() => expect(screen.getByTestId('suggestions')).toHaveTextContent('QA-401'));
    expect(screen.getByText('Pedidos para hoje: 17')).toBeInTheDocument();
    expect(callsFor('/api/v1/auth/refresh')).toHaveLength(1);
    expect(callsFor(protectedPath)).toHaveLength(2);
  });

  it('mantém 403 nas sugestões como indisponibilidade, sem renovar ou inventar dados', async () => {
    vi.stubGlobal('fetch', vi.fn(async (url) => url === '/api/v1/dispatch/suggestions'
      ? response(403, { detail: 'Forbidden' })
      : response(200, payloads[url])));
    mount();
    await waitFor(() => expect(callsFor('/api/v1/dispatch/suggestions')).toHaveLength(1));
    await waitFor(() => expect(screen.getByText('Pedidos para hoje: 17')).toBeInTheDocument());
    expect(screen.getByTestId('suggestions')).toHaveTextContent('{}');
    expect(callsFor('/api/v1/auth/refresh')).toHaveLength(0);
    expect(localStorage.getItem('adminUser')).not.toBeNull();
  });

  it.each(['servidor', 'rede'])('mantém falha de %s no resumo como erro após retries limitados', async (failure) => {
    vi.useFakeTimers();
    vi.stubGlobal('fetch', vi.fn(async (url) => {
      if (url === '/api/v1/command-center/summary') {
        if (failure === 'rede') throw new Error('Rede indisponível');
        return response(500, { detail: 'Resumo indisponível' });
      }
      return response(200, payloads[url]);
    }));
    mount();
    await act(async () => { await vi.advanceTimersByTimeAsync(7000); });
    expect(screen.getByText('Não foi possível carregar os dados')).toBeInTheDocument();
    expect(screen.queryByText('Pedidos para hoje: 17')).not.toBeInTheDocument();
    expect(screen.queryByTestId('suggestions')).not.toBeInTheDocument();
    expect(callsFor('/api/v1/command-center/summary')).toHaveLength(3);
    expect(callsFor('/api/v1/auth/refresh')).toHaveLength(0);
  });
});
