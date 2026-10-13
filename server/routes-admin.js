/** Admin API. Everything except /login needs a valid token; some routes are Admin-role only. */
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { getDB, saveDB } from './db.js';
import { login, requireAuth } from './auth.js';
import { adjustStock, setInquiryStatus, setOrderStatus, setPrice } from '../src/state/dbActions.js';
import { INQUIRY_STATUSES, ORDER_STATUSES, ROLES } from '../src/config/constants.js';

const router = Router();

// Executives get orders/inquiries/stock levels only; Admins also get stock history and audit log.
const viewFor = (db, role) =>
  role === ROLES.ADMIN ? db : { skus: db.skus, orders: db.orders, inquiries: db.inquiries, moves: [], audit: [] };

const actorOf = (req) => ({ name: req.user.username });
const commit = (req, res, next) => {
  saveDB(next);
  res.json(viewFor(next, req.user.role));
};

router.post(
  '/login',
  rateLimit({ windowMs: 15 * 60e3, max: 10, skipSuccessfulRequests: true, standardHeaders: true, legacyHeaders: false, message: { error: 'Too many attempts. Try again in 15 minutes.' } }),
  (req, res) => {
    const session = login(String(req.body?.username ?? ''), String(req.body?.password ?? ''));
    if (!session) return res.status(401).json({ error: 'Invalid username or password' });
    res.json(session);
  },
);

router.use(requireAuth());

router.get('/db', (req, res) => res.json(viewFor(getDB(), req.user.role)));

router.patch('/orders/:id', (req, res) => {
  const { status } = req.body || {};
  if (!ORDER_STATUSES.includes(status)) return res.status(400).json({ error: 'Invalid status' });
  if (!getDB().orders.some((o) => o.id === req.params.id)) return res.status(404).json({ error: 'Order not found' });
  commit(req, res, setOrderStatus(getDB(), req.params.id, status, actorOf(req)));
});

router.patch('/inquiries/:id', (req, res) => {
  const { status } = req.body || {};
  if (!INQUIRY_STATUSES.includes(status)) return res.status(400).json({ error: 'Invalid status' });
  if (!getDB().inquiries.some((q) => q.id === req.params.id)) return res.status(404).json({ error: 'Inquiry not found' });
  commit(req, res, setInquiryStatus(getDB(), req.params.id, status, actorOf(req)));
});

router.post('/inventory/:id/adjust', requireAuth(ROLES.ADMIN), (req, res) => {
  const delta = Number(req.body?.delta);
  if (!Number.isInteger(delta) || delta === 0 || Math.abs(delta) > 100000) return res.status(400).json({ error: 'Invalid quantity' });
  if (!getDB().skus.some((s) => s.id === req.params.id)) return res.status(404).json({ error: 'Pack not found' });
  commit(req, res, adjustStock(getDB(), req.params.id, delta, '', actorOf(req)));
});

router.patch('/inventory/:id/price', requireAuth(ROLES.ADMIN), (req, res) => {
  const price = Number(req.body?.price);
  if (!(price > 0) || price > 10000000) return res.status(400).json({ error: 'Invalid price' });
  if (!getDB().skus.some((s) => s.id === req.params.id)) return res.status(404).json({ error: 'Pack not found' });
  commit(req, res, setPrice(getDB(), req.params.id, price, actorOf(req)));
});

export default router;
