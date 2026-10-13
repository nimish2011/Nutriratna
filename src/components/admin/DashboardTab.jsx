import { inr } from '../../utils/format';

/** KPIs, low-stock alerts and units/revenue per pack (cancelled orders excluded). */
export default function DashboardTab({ db }) {
  const liveOrders = db.orders.filter((o) => o.status !== 'Cancelled');
  const revenue = liveOrders.reduce((sum, o) => sum + o.total, 0);
  const lowStock = db.skus.filter((s) => s.stock <= s.minStock);
  const openInquiries = db.inquiries.filter((q) => q.status === 'New').length;

  const unitsSold = (skuId) =>
    liveOrders.reduce((sum, o) => sum + (o.items.find((i) => i.id === skuId)?.qty || 0), 0);

  return (
    <div>
      <div className="kpi">
        <div className="card"><span className="mut">Revenue</span><b>{inr(revenue)}</b></div>
        <div className="card"><span className="mut">Orders</span><b>{db.orders.length}</b></div>
        <div className="card"><span className="mut">Open inquiries</span><b>{openInquiries}</b></div>
        <div className="card">
          <span className="mut">Low-stock alerts</span>
          <b className={lowStock.length ? 'text-bad' : 'text-ok'}>{lowStock.length}</b>
        </div>
      </div>

      {lowStock.map((s) => (
        <span className="pill bad alert" key={s.id}>⚠ {s.label}: {s.stock} left (min {s.minStock})</span>
      ))}

      <h3 className="sub-title">Sales by pack</h3>
      <div className="card">
        {db.skus.map((s) => (
          <div className="row" key={s.id}>
            <span>{s.label}</span>
            <span>{unitsSold(s.id)} units · {inr(unitsSold(s.id) * s.price)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
