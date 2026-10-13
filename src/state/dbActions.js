/**
 * All business rules live here as PURE functions: (db, ...args) -> new db.
 * No React in this file, so it is easy to read, test and debug.
 * Admin actions record an audit entry; stock changes record a stock movement.
 */
import { inr, nowISO } from '../utils/format.js';
import { priceCart } from '../utils/cart.js';

const auditEntry = (actor, action, detail) => ({ time: nowISO(), user: actor.name, action, detail });

const stockMove = (label, delta, reason, user) => ({ time: nowISO(), skuLabel: label, delta, reason, user });

/** Customer places an order. Returns { db, orderId } or { error }. */
export function placeOrder(db, customer, cart) {
  const { lines, total } = priceCart(db.skus, cart);
  if (!lines.length || lines.length !== cart.length) return { error: 'Some items in your cart are no longer available' };

  // Prevent overselling: re-check stock at the moment of ordering.
  for (const { sku, qty } of lines) {
    if (sku.stock < qty) return { error: `Only ${sku.stock} of ${sku.label} left in stock` };
  }

  const orderId = `NR-${1001 + db.orders.length}`;
  const order = {
    id: orderId,
    createdAt: nowISO(),
    customer,
    total,
    status: 'Confirmed',
    items: lines.map(({ sku, qty }) => ({ id: sku.id, label: sku.label, qty, price: sku.price })),
  };

  return {
    orderId,
    db: {
      ...db,
      orders: [order, ...db.orders],
      skus: db.skus.map((s) => {
        const line = lines.find((l) => l.sku.id === s.id);
        return line ? { ...s, stock: s.stock - line.qty } : s;
      }),
      moves: [...lines.map((l) => stockMove(l.sku.label, -l.qty, `Order ${orderId}`, 'system')), ...db.moves],
    },
  };
}

/** Customer submits a bulk / wholesale inquiry. */
export function submitInquiry(db, form) {
  const inquiry = { ...form, id: `Q-${db.inquiries.length + 1}`, createdAt: nowISO(), status: 'New' };
  return { ...db, inquiries: [inquiry, ...db.inquiries] };
}

/** Admin changes an order's status. Cancelling returns the stock. */
export function setOrderStatus(db, orderId, status, actor) {
  const order = db.orders.find((o) => o.id === orderId);
  if (!order) return db;

  let { skus, moves } = db;
  if (status === 'Cancelled' && order.status !== 'Cancelled') {
    skus = skus.map((s) => {
      const item = order.items.find((i) => i.id === s.id);
      return item ? { ...s, stock: s.stock + item.qty } : s;
    });
    moves = [...order.items.map((i) => stockMove(i.label, i.qty, `Cancelled ${orderId}`, actor.name)), ...moves];
  }

  return {
    ...db,
    skus,
    moves,
    orders: db.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
    audit: [auditEntry(actor, 'Order status', `${orderId} → ${status}`), ...db.audit],
  };
}

/** Admin changes an inquiry's status. */
export function setInquiryStatus(db, inquiryId, status, actor) {
  const inquiry = db.inquiries.find((q) => q.id === inquiryId);
  if (!inquiry) return db;
  return {
    ...db,
    inquiries: db.inquiries.map((q) => (q.id === inquiryId ? { ...q, status } : q)),
    audit: [auditEntry(actor, 'Inquiry status', `${inquiry.business} → ${status}`), ...db.audit],
  };
}

/** Admin adds/removes stock manually. Never goes below zero. */
export function adjustStock(db, skuId, delta, reason, actor) {
  const sku = db.skus.find((s) => s.id === skuId);
  if (!sku || !delta) return db;
  return {
    ...db,
    skus: db.skus.map((s) => (s.id === skuId ? { ...s, stock: Math.max(0, s.stock + delta) } : s)),
    moves: [stockMove(sku.label, delta, reason || 'Manual adjustment', actor.name), ...db.moves],
    audit: [auditEntry(actor, 'Stock adjusted', `${sku.label} ${delta > 0 ? '+' : ''}${delta}`), ...db.audit],
  };
}

/** Admin changes a pack price. */
export function setPrice(db, skuId, price, actor) {
  const sku = db.skus.find((s) => s.id === skuId);
  const value = Number(price);
  if (!sku || !(value > 0) || value === sku.price) return db;
  return {
    ...db,
    skus: db.skus.map((s) => (s.id === skuId ? { ...s, price: value } : s)),
    audit: [auditEntry(actor, 'Price changed', `${sku.label}: ${inr(sku.price)} → ${inr(value)}`), ...db.audit],
  };
}
