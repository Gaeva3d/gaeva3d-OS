/**
 * useCommandCenter - Hook for fetching Command Center data
 *
 * Provides action items, summary stats, and resource statuses
 * with auto-refresh capability.
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { useApi } from './useApi';

/**
 * Fetch action items requiring attention
 */
export function useActionItems(autoRefresh = false, refreshInterval = 60000) {
  const api = useApi();
  const [items, setItems] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  const fetchData = useCallback(async () => {
    if (!localStorage.getItem('adminUser')) {
      setError('Not authenticated');
      setLoading(false);
      return;
    }

    try {
      const data = await api.get('/api/v1/command-center/action-items');
      if (data === undefined) throw new Error('Not authenticated');
      setItems(data.items || []);
      setCounts(data.counts_by_type || {});
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchData();

    if (autoRefresh && refreshInterval > 0) {
      intervalRef.current = setInterval(fetchData, refreshInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchData, autoRefresh, refreshInterval]);

  return { items, counts, loading, error, refetch: fetchData };
}

/**
 * Fetch today's summary statistics
 */
export function useSummary(autoRefresh = false, refreshInterval = 60000) {
  const api = useApi();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  const fetchData = useCallback(async () => {
    if (!localStorage.getItem('adminUser')) {
      setError('Not authenticated');
      setLoading(false);
      return;
    }

    try {
      const data = await api.get('/api/v1/command-center/summary');
      if (data === undefined) throw new Error('Not authenticated');
      setSummary(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchData();

    if (autoRefresh && refreshInterval > 0) {
      intervalRef.current = setInterval(fetchData, refreshInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchData, autoRefresh, refreshInterval]);

  return { summary, loading, error, refetch: fetchData };
}

/**
 * Fetch resource/machine statuses
 */
export function useResourceStatuses(autoRefresh = false, refreshInterval = 30000) {
  const api = useApi();
  const [resources, setResources] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  const fetchData = useCallback(async () => {
    if (!localStorage.getItem('adminUser')) {
      setError('Not authenticated');
      setLoading(false);
      return;
    }

    try {
      const data = await api.get('/api/v1/command-center/resources');
      if (data === undefined) throw new Error('Not authenticated');
      setResources(data.resources || []);
      setSummary(data.summary || {});
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchData();

    if (autoRefresh && refreshInterval > 0) {
      intervalRef.current = setInterval(fetchData, refreshInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchData, autoRefresh, refreshInterval]);

  return { resources, summary, loading, error, refetch: fetchData };
}

/**
 * Combined hook for all Command Center data
 */
export function useCommandCenter(autoRefresh = true, refreshInterval = 60000) {
  const actionItems = useActionItems(autoRefresh, refreshInterval);
  const todaySummary = useSummary(autoRefresh, refreshInterval);
  const resourceStatuses = useResourceStatuses(autoRefresh, refreshInterval / 2); // Resources refresh faster

  const refetchAll = useCallback(() => {
    actionItems.refetch();
    todaySummary.refetch();
    resourceStatuses.refetch();
  }, [actionItems, todaySummary, resourceStatuses]);

  const loading = actionItems.loading || todaySummary.loading || resourceStatuses.loading;
  const error = actionItems.error || todaySummary.error || resourceStatuses.error;

  return {
    actionItems: actionItems.items,
    actionCounts: actionItems.counts,
    summary: todaySummary.summary,
    resources: resourceStatuses.resources,
    resourceSummary: resourceStatuses.summary,
    loading,
    error,
    refetch: refetchAll
  };
}

export default useCommandCenter;
