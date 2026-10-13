/**
 * DATA LAYER: every call the website makes to the server lives here.
 * Errors are thrown as Error(message) with the server's friendly message.
 */
async function request(path, { method = 'GET', body, token } = {}) {
  let res;
  try {
    res = await fetch(`/api${path}`, {
      method,
      headers: { ...(body ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('Cannot reach the server. Please check your connection and try again.');
  }
  let data = null;
  try { data = await res.json(); } catch { /* empty body */ }
  if (!res.ok) {
    const err = new Error(data?.error || 'Something went wrong. Please try again.');
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  // customer
  products: () => request('/products'),
  placeOrder: (customer, cart) => request('/orders', { method: 'POST', body: { customer, cart } }),
  trackOrder: (id, phone) => request('/orders/track', { method: 'POST', body: { id, phone } }),
  submitInquiry: (form) => request('/inquiries', { method: 'POST', body: form }),
  // admin (token required)
  login: (username, password) => request('/admin/login', { method: 'POST', body: { username, password } }),
  admin: {
    db: (t) => request('/admin/db', { token: t }),
    setOrderStatus: (t, id, status) => request(`/admin/orders/${id}`, { method: 'PATCH', body: { status }, token: t }),
    setInquiryStatus: (t, id, status) => request(`/admin/inquiries/${id}`, { method: 'PATCH', body: { status }, token: t }),
    adjustStock: (t, id, delta) => request(`/admin/inventory/${id}/adjust`, { method: 'POST', body: { delta }, token: t }),
    setPrice: (t, id, price) => request(`/admin/inventory/${id}/price`, { method: 'PATCH', body: { price }, token: t }),
  },
};
