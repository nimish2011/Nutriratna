import { INQUIRY_STATUSES } from '../../config/constants';
import { formatDate } from '../../utils/format';
import { mailtoLink, whatsappLink } from '../../utils/contact';

/** Every bulk inquiry customers sent, newest first, with one-click WhatsApp / email reply. */
export default function InquiriesTab({ inquiries, onStatus }) {
  if (!inquiries.length) {
    return <div className="card"><p className="mut">No bulk inquiries yet.</p></div>;
  }
  return (
    <div className="tbl card">
      <table>
        <thead>
          <tr><th>Ref</th><th>Date</th><th>Business</th><th>Contact</th><th>Requirement</th><th>Reply</th><th>Status</th></tr>
        </thead>
        <tbody>
          {inquiries.map((q) => (
            <tr key={q.id} className={q.status === 'New' ? 'row-new' : undefined}>
              <td>{q.id}</td>
              <td>{formatDate(q.createdAt)}</td>
              <td>{q.business}<div className="mut">{q.name} · {q.type}</div><div className="mut">{q.city}</div></td>
              <td>{q.phone}<div className="mut">{q.email}</div></td>
              <td className="wrap-cell">{q.qty} kg/month · {q.pack}<div className="mut">{q.message}</div></td>
              <td>
                <div className="row adjust-row">
                  <a className="btn sm wa" href={whatsappLink(q.phone, `Hello ${q.name}, thank you for your inquiry (${q.id}) with NutriRatna.`)} target="_blank" rel="noopener noreferrer">WhatsApp</a>
                  <a className="btn ghost sm" href={mailtoLink(q.email, `NutriRatna — your inquiry ${q.id}`, `Hello ${q.name},\n\nThank you for your inquiry.\n`)}>Email</a>
                </div>
              </td>
              <td>
                <select value={q.status} onChange={(e) => onStatus(q.id, e.target.value)}>
                  {INQUIRY_STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
