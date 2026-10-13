import { useState } from 'react';

/** Cart state: [{ id, qty }]. Quantities are capped at available stock. */
export function useCart(skus) {
  const [cart, setCart] = useState([]);
  const stockOf = (id) => skus.find((s) => s.id === id)?.stock ?? 0;

  return {
    cart,
    count: cart.reduce((sum, c) => sum + c.qty, 0),
    add(id, qty) {
      setCart((prev) => {
        const existing = prev.find((c) => c.id === id);
        const next = Math.min(stockOf(id), (existing?.qty || 0) + qty);
        return existing
          ? prev.map((c) => (c.id === id ? { ...c, qty: next } : c))
          : [...prev, { id, qty: next }];
      });
    },
    setQty(id, qty) {
      setCart((prev) =>
        prev.map((c) => (c.id === id ? { ...c, qty: Math.max(1, Math.min(stockOf(id), qty)) } : c)),
      );
    },
    remove: (id) => setCart((prev) => prev.filter((c) => c.id !== id)),
    clear: () => setCart([]),
  };
}
