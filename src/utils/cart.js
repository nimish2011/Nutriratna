import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from '../config/constants.js';

/**
 * Turns the cart ([{ id, qty }]) into priced lines + totals.
 * Pure function: same input -> same output, easy to test.
 */
export function priceCart(skus, cart) {
  const lines = cart
    .map((c) => ({ sku: skus.find((s) => s.id === c.id), qty: c.qty }))
    .filter((l) => l.sku);
  const subtotal = lines.reduce((sum, l) => sum + l.sku.price * l.qty, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  return { lines, subtotal, shipping, total: subtotal + shipping };
}
