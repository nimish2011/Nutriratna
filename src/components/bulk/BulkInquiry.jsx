import { useState } from 'react';
import { BULK_PACKS, BUSINESS_TYPES, CONTACT } from '../../config/constants';
import { api } from '../../services/api';
import { validateInquiry } from '../../utils/validation';
import { whatsappLink } from '../../utils/contact';
import Field from '../common/Field';

const EMPTY = { name: '', business: '', type: '', phone: '', email: '', qty: '', pack: '', city: '', message: '' };

/**
 * Wholesale / B2B inquiry form. EVERY field is required (checked in the browser and again on the server).
 * Submissions are saved on the server and appear in Admin → Inquiries.
 */
export default function BulkInquiry() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent
  const [serverError, setServerError] = useState('');
  const [reference, setReference] = useState('');
  const [trap, setTrap] = useState(''); // hidden spam-trap field; humans never fill it

  const bind = (key) => ({
    value: form[key],
    required: true,
    onChange: (e) => setForm({ ...form, [key]: e.target.value }),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { ok, errors: found } = validateInquiry(form);
    setErrors(found);
    if (!ok) return;
    setStatus('sending');
    setServerError('');
    try {
      const result = await api.submitInquiry({ ...form, website: trap });
      setReference(result.id);
      setForm(EMPTY);
      setStatus('sent');
    } catch (err) {
      setServerError(err.message);
      setStatus('idle');
    }
  };

  return (
    <section className="band" id="bulk">
      <div className="wrap narrow">
        <div className="sh">
          <h2>Bulk &amp; Wholesale Inquiry</h2>
          <p>Dealers, distributors, retailers and shopkeepers — get a custom quotation within 24 hours.</p>
          <p>
            Prefer to talk? <a className="band-link" href={`tel:${CONTACT.phoneTel}`}>{CONTACT.phoneDisplay}</a> ·{' '}
            <a className="band-link" href={whatsappLink(null, 'Hello NutriRatna, I have a bulk requirement.')} target="_blank" rel="noopener noreferrer">WhatsApp</a> ·{' '}
            <a className="band-link" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          </p>
        </div>

        {status === 'sent' ? (
          <div className="card done-card">
            <div className="done-icon">✅</div>
            <h3>Inquiry received</h3>
            <p>Your reference is <b>{reference}</b>. Our team will contact you on WhatsApp or email shortly.</p>
            <button className="btn" onClick={() => setStatus('idle')}>Send another inquiry</button>
          </div>
        ) : (
          <form className="f card" onSubmit={handleSubmit} noValidate>
            <Field label="Your name" error={errors.name}><input autoComplete="name" {...bind('name')} /></Field>
            <Field label="Business name" error={errors.business}><input autoComplete="organization" {...bind('business')} /></Field>
            <Field label="Business type" error={errors.type}>
              <select {...bind('type')}>
                <option value="" disabled>Select…</option>
                {BUSINESS_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Delivery city / state" error={errors.city}><input {...bind('city')} /></Field>
            <Field label="Phone / WhatsApp (10-digit)" error={errors.phone}><input type="tel" inputMode="numeric" autoComplete="tel" {...bind('phone')} /></Field>
            <Field label="Email" error={errors.email}><input type="email" autoComplete="email" {...bind('email')} /></Field>
            <Field label="Preferred pack" error={errors.pack}>
              <select {...bind('pack')}>
                <option value="" disabled>Select…</option>
                {BULK_PACKS.map((p) => <option key={p}>{p}</option>)}
              </select>
            </Field>
            <Field label="Estimated quantity (kg / month)" error={errors.qty}><input type="number" min="1" step="1" {...bind('qty')} /></Field>
            <Field label="Your requirements" full error={errors.message}><textarea rows="3" minLength="10" maxLength="1000" {...bind('message')} /></Field>

            {/* Spam trap: hidden from people, bots fill it in. */}
            <input className="trap" tabIndex="-1" autoComplete="off" aria-hidden="true" value={trap} onChange={(e) => setTrap(e.target.value)} name="website" />

            {serverError && <div className="full pill bad">{serverError}</div>}
            {Object.keys(errors).length > 0 && <div className="full pill bad">Please fill in every field correctly — all fields are required.</div>}
            <button className="btn gold full" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Request quotation'}</button>
            <div className="full mut">All fields marked * are required. We reply on WhatsApp or email.</div>
          </form>
        )}
      </div>
    </section>
  );
}
