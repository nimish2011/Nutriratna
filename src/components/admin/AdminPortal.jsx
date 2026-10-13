import { useState } from 'react';
import { ADMIN_TABS, ROLES } from '../../config/constants';
import DashboardTab from './DashboardTab';
import OrdersTab from './OrdersTab';
import InquiriesTab from './InquiriesTab';
import InventoryTab from './InventoryTab';
import AuditTab from './AuditTab';

/** Admin shell: shows only the tabs the signed-in role may use, then renders the active tab. */
export default function AdminPortal({ admin }) {
  const { user, db, actions } = admin;
  const [active, setActive] = useState('dashboard');
  const tabs = ADMIN_TABS.filter((t) => !t.adminOnly || user.role === ROLES.ADMIN);
  const newInquiries = db ? db.inquiries.filter((q) => q.status === 'New').length : 0;

  return (
    <section>
      <div className="wrap">
        <div className="row admin-head">
          <div>
            <h2>Admin Portal</h2>
            <span className="mut">{user.username} · {user.role}</span>
          </div>
          <div className="row">
            <button className="btn ghost sm" onClick={admin.refresh}>↻ Refresh</button>
            <button className="btn ghost sm" onClick={admin.logout}>Sign out</button>
          </div>
        </div>

        <div className="tabs">
          {tabs.map((t) => (
            <button key={t.id} className={active === t.id ? 'on' : ''} onClick={() => setActive(t.id)}>
              {t.label}{t.id === 'inquiries' && newInquiries > 0 && <span className="badge">{newInquiries}</span>}
            </button>
          ))}
        </div>

        {admin.error && <p className="pill bad">{admin.error}</p>}
        {!db && <p className="mut">Loading…</p>}

        {db && active === 'dashboard' && <DashboardTab db={db} />}
        {db && active === 'orders' && <OrdersTab orders={db.orders} onStatus={actions.setOrderStatus} />}
        {db && active === 'inquiries' && <InquiriesTab inquiries={db.inquiries} onStatus={actions.setInquiryStatus} />}
        {db && active === 'inventory' && <InventoryTab skus={db.skus} moves={db.moves} onAdjust={actions.adjustStock} onPrice={actions.setPrice} />}
        {db && active === 'audit' && <AuditTab audit={db.audit} />}
      </div>
    </section>
  );
}
