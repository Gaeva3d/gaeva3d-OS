import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import useCommandCenter from '../useCommandCenter';

vi.mock('../../config/api', () => ({ API_URL: '' }));

const payloads = {
  '/api/v1/command-center/action-items': {
    items: [{ id: 'order-7', entity_id: 7, title: 'Pedido de teste' }],
    counts_by_type: { order: 1 },
  },
  '/api/v1/command-center/summary': { orders_due_today: 7, production_in_progress: 3 },
  '/api/v1/command-center/resources': {
    resources: [{ id: 9, code: 'IMP-9', status: 'idle' }],
    summary: { idle: 1 },
  },
};

const response = (status, body = {}) => ({
  ok: status >= 200 && status < 300,
  status,
  headers: { get: () => 'application/json' },
  json: async () => body,
});

function expiredSession({ refreshStatus = 200, retryStatus = 200 } = {}) {
  let releaseRefresh;
  let renewed = false;
  const gate = new Promise((resolve) => { releaseRefresh = resolve; });
  const fetchMock = vi.fn(async (url) => {
    if (url === '/api/v1/auth/refresh') {
      await gate;
      renewed = refreshStatus === 200;
      return response(refreshStatus);
    }
    const status = renewed ? retryStatus : 401;
    return response(status, status === 200 ? payloads[url] : { detail: 'Unauthorized' });
  });
  vi.stubGlobal('fetch', fetchMock);
  return { fetchMock, releaseRefresh };
}

const refreshCalls = (fetchMock) => fetchMock.mock.calls.filter(([url]) => url === '/api/v1/auth/refresh');
const dataCalls = (fetchMock) => fetchMock.mock.calls.filter(([url]) => url in payloads);

beforeEach(() => {
  window.history.replaceState({}, '', '/admin');
  localStorage.setItem('adminUser', JSON.stringify({ id: 1, account_type: 'admin' }));
});

afterEach(() => {
  cleanup();
  localStorage.clear();
  window.history.replaceState({}, '', '/');
  vi.unstubAllGlobals();
});

describe('Command Center uses the canonical authenticated client', () => {
  it('recovers all three concurrent reads with one refresh and preserves their actual payloads', async () => {
    const { fetchMock, releaseRefresh } = expiredSession();
    const { result } = renderHook(() => useCommandCenter(false));
    await waitFor(() => expect(refreshCalls(fetchMock)).toHaveLength(1));
    expect(dataCalls(fetchMock)).toHaveLength(3);
    await act(async () => { releaseRefresh(); });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeNull();
    expect(result.current.summary).toEqual(payloads['/api/v1/command-center/summary']);
    expect(result.current.actionItems).toEqual(payloads['/api/v1/command-center/action-items'].items);
    expect(result.current.resources).toEqual(payloads['/api/v1/command-center/resources'].resources);
    expect(result.current.resourceSummary).toEqual({ idle: 1 });
    expect(refreshCalls(fetchMock)).toHaveLength(1);
    expect(dataCalls(fetchMock)).toHaveLength(6);
    for (const [, init] of fetchMock.mock.calls) expect(init.credentials).toBe('include');
    expect(localStorage.getItem('adminUser')).not.toBeNull();
  });

  it('fails closed when refresh is invalid instead of publishing an empty successful summary', async () => {
    // Exercise the existing session cleanup without asking jsdom to navigate.
    window.history.replaceState({}, '', '/admin/login');
    const { fetchMock, releaseRefresh } = expiredSession({ refreshStatus: 401 });
    const { result } = renderHook(() => useCommandCenter(false));
    await waitFor(() => expect(refreshCalls(fetchMock)).toHaveLength(1));
    await act(async () => { releaseRefresh(); });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(localStorage.getItem('adminUser')).toBeNull();
    expect(result.current.error).toBe('Not authenticated');
    expect(result.current.summary).toBeNull();
    expect(dataCalls(fetchMock)).toHaveLength(3);
    expect(refreshCalls(fetchMock)).toHaveLength(1);
  });

  it('does not loop when the original reads still return 401 after a successful refresh', async () => {
    window.history.replaceState({}, '', '/admin/login');
    const { fetchMock, releaseRefresh } = expiredSession({ retryStatus: 401 });
    const { result } = renderHook(() => useCommandCenter(false));
    await waitFor(() => expect(refreshCalls(fetchMock)).toHaveLength(1));
    await act(async () => { releaseRefresh(); });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(localStorage.getItem('adminUser')).toBeNull();
    expect(result.current.error).toBe('Not authenticated');
    expect(result.current.summary).toBeNull();
    expect(dataCalls(fetchMock)).toHaveLength(6);
    expect(refreshCalls(fetchMock)).toHaveLength(1);
  });

  it('keeps a forbidden response as an error without refreshing or clearing the session', async () => {
    const fetchMock = vi.fn(async () => response(403, { detail: 'Forbidden' }));
    vi.stubGlobal('fetch', fetchMock);
    const { result } = renderHook(() => useCommandCenter(false));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Forbidden');
    expect(result.current.summary).toBeNull();
    expect(refreshCalls(fetchMock)).toHaveLength(0);
    expect(dataCalls(fetchMock)).toHaveLength(3);
    expect(localStorage.getItem('adminUser')).not.toBeNull();
  });

  it('does not request data when the existing signed-in hint is absent', async () => {
    localStorage.removeItem('adminUser');
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const { result } = renderHook(() => useCommandCenter(false));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Not authenticated');
    expect(result.current.summary).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
