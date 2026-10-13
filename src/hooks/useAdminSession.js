import { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api';

const KEY = 'nutriratna_admin_session'; // sessionStorage: cleared when the tab closes

const readSession = () => {
  try { return JSON.parse(sessionStorage.getItem(KEY)); } catch { return null; }
};

/** Admin login state + the data the admin portal shows (orders, inquiries, stock, logs). */
export function useAdminSession() {
  const [session, setSession] = useState(readSession);
  const [db, setDb] = useState(null);
  const [error, setError] = useState('');

  const logout = useCallback(() => {
    try { sessionStorage.removeItem(KEY); } catch { /* ignore */ }
    setSession(null);
    setDb(null);
  }, []);

  // Runs a server call with the token and stores the fresh data it returns.
  const run = useCallback(async (call) => {
    try {
      setDb(await call(session.token));
      setError('');
    } catch (e) {
      if (e.status === 401) logout();
      else setError(e.message);
    }
  }, [session, logout]);

  // Load on sign-in, then re-check every 30 s so new inquiries/orders appear without reloading.
  useEffect(() => {
    if (!session) return undefined;
    run(api.admin.db);
    const timer = setInterval(() => run(api.admin.db), 30000);
    return () => clearInterval(timer);
  }, [session, run]);

  return {
    session,
    user: session?.user,
    db,
    error,
    refresh: () => run(api.admin.db),
    // Returns '' on success or an error message.
    async login(username, password) {
      try {
        const result = await api.login(username, password);
        try { sessionStorage.setItem(KEY, JSON.stringify(result)); } catch { /* ignore */ }
        setSession(result);
        return '';
      } catch (e) {
        return e.message;
      }
    },
    logout,
    actions: {
      setOrderStatus: (id, status) => run((t) => api.admin.setOrderStatus(t, id, status)),
      setInquiryStatus: (id, status) => run((t) => api.admin.setInquiryStatus(t, id, status)),
      adjustStock: (id, delta) => run((t) => api.admin.adjustStock(t, id, delta)),
      setPrice: (id, price) => run((t) => api.admin.setPrice(t, id, price)),
    },
  };
}
