import ProductCard from './ProductCard';

export default function ProductGrid({ products, onAddToCart }) {
  const { skus, loading, error, refresh } = products;
  return (
    <section id="shop">
      <div className="wrap">
        <div className="sh">
          <h2>Raw Makhana</h2>
          <p>Gem of the Mother Nature · pouches up to 1 kg, sacks for 5 kg &amp; 10 kg</p>
        </div>
        {loading && <p className="mut center">Loading products…</p>}
        {error && (
          <div className="center">
            <p className="pill bad">{error}</p> <button className="btn sm" onClick={refresh}>Retry</button>
          </div>
        )}
        <div className="grid">
          {skus.map((sku) => <ProductCard key={sku.id} sku={sku} onAdd={onAddToCart} />)}
        </div>
      </div>
    </section>
  );
}
