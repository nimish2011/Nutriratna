// All fixed values live here so business rules are easy to find and change.
// This file is shared by the website AND the server.

// Business contact details shown on the website.
export const CONTACT = {
  email: 'portricglobal@gmail.com',
  phoneDisplay: '+91 93112 86008',
  phoneTel: '+919311286008',
  whatsappNumber: '919311286008', // international format, no "+"
};

export const FREE_SHIPPING_THRESHOLD = 999; // ₹ — orders at/above this ship free
export const SHIPPING_FEE = 60; // ₹

export const ORDER_STATUSES = ['Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];
export const TRACKING_STEPS = ORDER_STATUSES.slice(0, 4); // steps shown on the tracking page
export const INQUIRY_STATUSES = ['New', 'Contacted', 'Quoted', 'Won', 'Lost'];

export const BUSINESS_TYPES = ['Retailer', 'Shopkeeper', 'Dealer', 'Distributor', 'Other'];
export const BULK_PACKS = ['1 kg', '5 kg', '10 kg', 'Custom'];

// Packs up to 1 kg are sold in pouches; larger packs are sacks.
export const POUCH_IDS = ['250g', '500g', '1kg'];

export const ROLES = { ADMIN: 'Admin', EXECUTIVE: 'Executive' };

// Admin tabs. `adminOnly` tabs are hidden from Executives.
export const ADMIN_TABS = [
  { id: 'dashboard', label: 'Dashboard', adminOnly: false },
  { id: 'orders', label: 'Orders', adminOnly: false },
  { id: 'inquiries', label: 'Inquiries', adminOnly: false },
  { id: 'inventory', label: 'Inventory', adminOnly: true },
  { id: 'audit', label: 'Audit log', adminOnly: true },
];

// Starting data used the first time the server runs.
export const SEED_DB = {
  skus: [
    { id: '250g', label: '250 g', weightKg: 0.25, price: 249, stock: 120, minStock: 20 },
    { id: '500g', label: '500 g', weightKg: 0.5, price: 459, stock: 90, minStock: 20 },
    { id: '1kg', label: '1 kg', weightKg: 1, price: 849, stock: 60, minStock: 15 },
    { id: '5kg', label: '5 kg', weightKg: 5, price: 3999, stock: 25, minStock: 5 },
    { id: '10kg', label: '10 kg', weightKg: 10, price: 7499, stock: 12, minStock: 3 },
  ],
  orders: [],
  inquiries: [],
  moves: [], // stock movement history
  audit: [], // admin action history
};
