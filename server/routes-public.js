/** Public API used by customers: products, orders, order tracking, bulk inquiries. */
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { getDB, saveDB } from './db.js';
import { placeOrder, submitInquiry } from '../src/state/dbActions.js';
import { normalizePhone, validateCustomer, validateInquiry } from '../src/utils/validation.js';

const limiter = (max, minutes) =>
  rateLimit({ windowMs: minutes * 60e3, max, standardHeaders: true, legacyHeaders: false, message: { error: 'Too many requests. Please try again later.' } });

const firstError = (errors) => Object.values(errors)[0];

/** Accepts only [{ id: string, qty: whole number }], merges duplicates. Returns null if malformed. */
function cleanCart(raw) {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > 10) return null;
  const merged = new Map();
  for (const item of raw) {
    const qty = Number(item?.qty);
    if (typeof item?.id !== 'string' || !Number.isInteger(qty) || qty < 1 || qty > 1000) return null;
    merged.set(item.id, (merged.get(item.id) || 0) + qty);
  }
  return [...merged].map(([id, qty]) => ({ id, qty }));
}

const router = Router();

router.get('/products', (req, res) => res.json(getDB().skus));

router.post('/orders', limiter(20, 60), (req, res) => {
  const { ok, errors, clean } = validateCustomer(req.body?.customer);
  if (!ok) return res.status(400).json({ error: firstError(errors) });
  const cart = cleanCart(req.body?.cart);
  if (!cart) return res.status(400).json({ error: 'Your cart is empty or invalid' });

  const result = placeOrder(getDB(), clean, cart); // prices & stock are always taken from the server
  if (result.error) return res.status(409).json({ error: result.error });
  saveDB(result.db);
  res.status(201).json({ orderId: result.orderId });
});

// Tracking needs order ID + the phone number used on the order (order IDs alone are guessable).
router.post('/orders/track', limiter(30, 15), (req, res) => {
  const id = String(req.body?.id || '').trim().toLowerCase();
  const phone = normalizePhone(req.body?.phone);
  const order = getDB().orders.find((o) => o.id.toLowerCase() === id && o.customer.phone === phone);
  if (!order) return res.status(404).json({ error: 'No order found for these details' });
  res.json({ id: order.id, status: order.status, createdAt: order.createdAt, total: order.total, city: order.customer.city, items: order.items });
});

router.post('/inquiries', limiter(10, 60), (req, res) => {
  if (req.body?.website) return res.json({ ok: true, id: 'Q-0' }); // hidden spam-trap field was filled by a bot
  const { ok, errors, clean } = validateInquiry(req.body);
  if (!ok) return res.status(400).json({ error: firstError(errors), errors });
  const next = submitInquiry(getDB(), clean);
  saveDB(next);
  res.status(201).json({ ok: true, id: next.inquiries[0].id });
});

export default router;
