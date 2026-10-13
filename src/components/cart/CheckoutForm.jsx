import { useState } from 'react';
import { inr } from '../../utils/format';
import { validateCustomer } from '../../utils/validation';
import Field from '../common/Field';

const EMPTY = { name: '', phone: '', email: '', address: '', city: '', pin: '' };

/**
 * Shipping details (all required). No online payment for now — the team confirms
 * the order and arranges payment by phone/WhatsApp. `onSubmit(customer)` returns an error string or nothing.
 */
export default function CheckoutForm({ total, onSubmit }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [sending, setSending] = useState(false);
  const bind = (key) => ({ value: form[key], required: true, onChange: (e) => setForm({ ...form, [key]: e.target.value }) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { ok, errors: found, clean } = validateCustomer(form);
    setErrors(found);
    if (!ok) return;
    setSending(true);
    setServerError((await onSubmit(clean)) || '');
    setSending(false);
  };

  return (
    <form className="f" onSubmit={handleSubmit} noValidate>
      <Field label="Full name" full error={errors.name}><input autoComplete="name" {...bind('name')} /></Field>
      <Field label="Mobile / WhatsApp" error={errors.phone}><input type="tel" inputMode="numeric" autoComplete="tel" {...bind('phone')} /></Field>
      <Field label="Email" error={errors.email}><input type="email" autoComplete="email" {...bind('email')} /></Field>
      <Field label="Address" full error={errors.address}><textarea rows="2" autoComplete="street-address" {...bind('address')} /></Field>
      <Field label="City" error={errors.city}><input autoComplete="address-level2" {...bind('city')} /></Field>
      <Field label="PIN code" error={errors.pin}><input inputMode="numeric" autoComplete="postal-code" {...bind('pin')} /></Field>
      {serverError && <div className="full pill bad">{serverError}</div>}
      <button className="btn gold full" disabled={sending}>{sending ? 'Placing order…' : `Place order · ${inr(total)}`}</button>
      <div className="full mut">No payment is taken on the website. Our team will contact you on WhatsApp / phone to confirm your order and arrange payment and delivery.</div>
    </form>
  );
}
