import { formatDate } from '../../utils/format';

export default function AuditTab({ audit }) {
  if (!audit.length) return <div className="card"><p className="mut">No admin actions recorded yet.</p></div>;
  return (
    <div className="tbl card">
      <table>
        <thead><tr><th>Time</th><th>User</th><th>Action</th><th>Detail</th></tr></thead>
        <tbody>
          {audit.map((a, i) => (
            <tr key={i}><td>{formatDate(a.time)}</td><td>{a.user}</td><td>{a.action}</td><td>{a.detail}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
