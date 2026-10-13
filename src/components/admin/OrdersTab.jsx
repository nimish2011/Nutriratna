import { ORDER_STATUSES } from '../../config/constants';
import { formatDate, inr } from '../../utils/format';
import { whatsappLink } from '../../utils/contact';

export default function OrdersTab({ orders, onStatus }) {
  if (!orders.length) {
    return <div className="card"><p className="mut">No orders yet.</p></div>;
  }
  return (
    <div className="tbl card">
      <table>
        <thead>
          <tr><th>ID</th><th>Date</th><th>Customer</th><th>Ship to</th><th>Items</th><th>Total</th><th>Contact</th><th>Status</th></tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className={o.status === 'Confirmed' ? 'row-new' : undefined}>
              <td>{o.id}</td>
              <td>{formatDate(o.createdAt)}</td>
              <td>{o.customer.name}<div className="mut">{o.customer.phone}</div><div className="mut">{o.customer.email}</div></td>
              <td className="wrap-cell">{o.customer.address}<div className="mut">{o.customer.city} – {o.customer.pin}</div></td>
              <td>{o.items.map((i) => `${i.label}×${i.qty}`).join(', ')}</td>
              <td>{inr(o.total)}</td>
              <td><a className="btn sm wa" href={whatsappLink(o.customer.phone, `Hello ${o.customer.name}, thank you for your NutriRatna order ${o.id}.`)} target="_blank" rel="noopener noreferrer">WhatsApp</a></td>
              <td>
                <select value={o.status} onChange={(e) => onStatus(o.id, e.target.value)}>
                  {ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
