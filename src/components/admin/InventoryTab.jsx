import { formatDate } from '../../utils/format';

const ADJUSTMENTS = [-10, -1, 1, 10, 50];

/** Admin only: edit prices, adjust stock, and review the stock movement history. */
export default function InventoryTab({ skus, moves, onAdjust, onPrice }) {
  return (
    <div>
      <div className="tbl card">
        <table>
          <thead><tr><th>Pack</th><th>Price (₹)</th><th>Stock</th><th>Adjust</th></tr></thead>
          <tbody>
            {skus.map((s) => (
              <tr key={s.id}>
                <td>{s.label}</td>
                <td>
                  {/* key forces the input to refresh after a saved price change */}
                  <input
                    key={s.price}
                    className="price-input"
                    type="number"
                    defaultValue={s.price}
                    onBlur={(e) => onPrice(s.id, e.target.value)}
                  />
                </td>
                <td><span className={`pill ${s.stock <= s.minStock ? 'bad' : 'ok'}`}>{s.stock}</span></td>
                <td>
                  <div className="row adjust-row">
                    {ADJUSTMENTS.map((d) => (
                      <button key={d} className="btn ghost sm" onClick={() => onAdjust(s.id, d)}>{d > 0 ? `+${d}` : d}</button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="sub-title">Stock movements</h3>
      <div className="tbl card">
        {!moves.length ? <p className="mut">No stock movements yet.</p> : (
          <table>
            <thead><tr><th>Time</th><th>Pack</th><th>Change</th><th>Reason</th><th>By</th></tr></thead>
            <tbody>
              {moves.slice(0, 30).map((m, i) => (
                <tr key={i}>
                  <td>{formatDate(m.time)}</td>
                  <td>{m.skuLabel}</td>
                  <td><span className={`pill ${m.delta > 0 ? 'ok' : 'bad'}`}>{m.delta > 0 ? '+' : ''}{m.delta}</span></td>
                  <td>{m.reason}</td>
                  <td>{m.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
