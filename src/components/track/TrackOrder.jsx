import { useState } from 'react';
import { ORDER_STATUSES, TRACKING_STEPS } from '../../config/constants';
import { api } from '../../services/api';
import { formatDate, inr } from '../../utils/format';

const STEP_ICONS = ['📋', '📦', '🚚', '🏡'];

/** Customer enters order ID + the mobile number used on the order. */
export default function TrackOrder() {
  const [id, setId] = useState('');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const search = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      setOrder(await api.trackOrder(id, phone));
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <section>
      <div className="wrap narrow">
        <div className="sh">
          <h2>Track your order</h2>
          <p>Enter your order ID and the mobile number you ordered with.</p>
        </div>
        <form className="f" onSubmit={search}>
          <input required placeholder="Order ID, e.g. NR-1001" value={id} onChange={(e) => setId(e.target.value)} />
          <input required type="tel" inputMode="numeric" placeholder="Mobile number" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <button className="btn full" disabled={loading}>{loading ? 'Checking…' : 'Track'}</button>
        </form>

        {error && <p className="pill bad track-msg">{error}</p>}

        {order && (
          <div className="card track-card">
            <div className="row">
              <h3>{order.id}</h3>
              <span className="pill">{order.status}</span>
            </div>
            <p className="mut">{formatDate(order.createdAt)} · {order.city}</p>

            <div className="row steps">
              {TRACKING_STEPS.map((step, i) => (
                <div key={step} className="step" style={{ opacity: ORDER_STATUSES.indexOf(order.status) >= i ? 1 : 0.35 }}>
                  <div className="step-icon">{STEP_ICONS[i]}</div>
                  <div className="mut">{step}</div>
                </div>
              ))}
            </div>

            {order.items.map((item) => (
              <div className="row" key={item.id}>
                <span>{item.label} × {item.qty}</span>
                <span>{inr(item.price * item.qty)}</span>
              </div>
            ))}
            <hr />
            <div className="row"><b>Total</b><b>{inr(order.total)}</b></div>
          </div>
        )}
      </div>
    </section>
  );
}
