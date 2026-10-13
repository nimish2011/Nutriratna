export const inr = (n) => '₹' + Number(n).toLocaleString('en-IN');

export const nowISO = () => new Date().toISOString();

export const formatDate = (iso) =>
  new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

export const pricePerKg = (sku) => Math.round(sku.price / sku.weightKg);
