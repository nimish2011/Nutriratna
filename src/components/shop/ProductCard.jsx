import { useState } from 'react';
import { inr, pricePerKg } from '../../utils/format';
import QtyStepper from '../common/QtyStepper';
import PackImage from './PackImage';

function StockBadge({ sku }) {
  if (sku.stock < 1) return <span className="pill bad">Sold out</span>;
  if (sku.stock <= sku.minStock) return <span className="pill">Only {sku.stock} left</span>;
  return <span className="pill ok">In stock</span>;
}

export default function ProductCard({ sku, onAdd }) {
  const [qty, setQty] = useState(1);
  const soldOut = sku.stock < 1;

  return (
    <div className="card pc">
      <PackImage sku={sku} />
      <div className="row">
        <h3 className="pack-title">{sku.label}</h3>
        <StockBadge sku={sku} />
      </div>
      <div className="mut">Raw Fox Nuts · {inr(pricePerKg(sku))}/kg</div>
      <div className="row buy-row">
        <span className="price">{inr(sku.price)}</span>
        <QtyStepper value={qty} onChange={setQty} max={sku.stock || 1} />
      </div>
      <button className="btn btn-block" disabled={soldOut} onClick={() => onAdd(sku, qty)}>
        {soldOut ? 'Unavailable' : 'Add to cart'}
      </button>
    </div>
  );
}
