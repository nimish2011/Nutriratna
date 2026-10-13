import { useState } from 'react';
import { FREE_SHIPPING_THRESHOLD } from '../../config/constants';
import { inr } from '../../utils/format';
import { priceCart } from '../../utils/cart';
import QtyStepper from '../common/QtyStepper';
import CheckoutForm from './CheckoutForm';

/**
 * Slide-in cart. Three steps: 'cart' -> 'checkout' -> 'done'.
 * `onPlaceOrder(customer)` returns { orderId } or { error } (e.g. out of stock).
 */
export default function CartDrawer({ skus, cartApi, onPlaceOrder, onClose }) {
  const [step, setStep] = useState('cart');
  const [orderId, setOrderId] = useState('');
  const { lines, subtotal, shipping, total } = priceCart(skus, cartApi.cart);

  // Returns an error message (shown in the form) or undefined on success.
  const placeOrder = async (customer) => {
    const result = await onPlaceOrder(customer);
    if (result.error) return result.error;
    cartApi.clear();
    setOrderId(result.orderId);
    setStep('done');
  };

  const title = { cart: 'Your Cart', checkout: 'Checkout', done: 'Order received' }[step];

  return (
    <div className="drawer" onClick={onClose}>
      <div className="dp" onClick={(e) => e.stopPropagation()}>
        <div className="row">
          <h2>{title}</h2>
          <button className="btn ghost sm" onClick={onClose}>Close</button>
        </div>

        {step === 'cart' && (
          <>
            {lines.length === 0 && <p className="mut">Your cart is empty.</p>}
            {lines.map(({ sku, qty }) => (
              <div className="card row" key={sku.id}>
                <div>
                  <b>Raw Makhana {sku.label}</b>
                  <div className="mut">{inr(sku.price)} each</div>
                </div>
                <QtyStepper value={qty} max={sku.stock} onChange={(q) => cartApi.setQty(sku.id, q)} />
                <b>{inr(sku.price * qty)}</b>
                <button className="btn ghost sm" onClick={() => cartApi.remove(sku.id)} aria-label="Remove">✕</button>
              </div>
            ))}
            <div className="card">
              <div className="row"><span>Subtotal</span><b>{inr(subtotal)}</b></div>
              <div className="row"><span>Shipping</span><b>{shipping ? inr(shipping) : 'Free'}</b></div>
              <div className="row serif total-row"><span>Total</span><b>{inr(total)}</b></div>
              <div className="mut">Free shipping on orders above {inr(FREE_SHIPPING_THRESHOLD)}</div>
            </div>
            <button className="btn gold" disabled={!lines.length} onClick={() => setStep('checkout')}>
              Proceed to checkout
            </button>
          </>
        )}

        {step === 'checkout' && <CheckoutForm total={total} onSubmit={placeOrder} />}

        {step === 'done' && (
          <div className="card done-card">
            <div className="done-icon">✅</div>
            <h3>Thank you!</h3>
            <p>Your order <b>{orderId}</b> is received. We will contact you on WhatsApp / phone to confirm it. You can track it anytime from “Track Order” using this ID and your mobile number.</p>
          </div>
        )}
      </div>
    </div>
  );
}
