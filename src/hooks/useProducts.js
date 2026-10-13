import { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api';

/** Loads the product list (prices + live stock) from the server. */
export function useProducts() {
  const [skus, setSkus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    try {
      setSkus(await api.products());
      setError('');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);
  return { skus, loading, error, refresh };
}
