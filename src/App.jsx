import { useState } from 'react';
import { api } from './services/api';
import { useProducts } from './hooks/useProducts';
import { useCart } from './hooks/useCart';
import { useToast } from './hooks/useToast';
import { useAdminSession } from './hooks/useAdminSession';
import TopBar from './components/layout/TopBar';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import WhatsAppButton from './components/layout/WhatsAppButton';
import StorePage from './components/shop/StorePage';
import CartDrawer from './components/cart/CartDrawer';
import TrackOrder from './components/track/TrackOrder';
import LoginForm from './components/admin/LoginForm';
import AdminPortal from './components/admin/AdminPortal';
import Toast from './components/common/Toast';

/**
 * Root component. Owns the app-wide state:
 *   products — pack list with live prices/stock from the server
 *   cart     — the shopper's cart
 *   admin    — admin login + the data shown in the admin portal
 * and decides which page (view) to show: 'shop' | 'track' | 'admin'.
 */
export default function App() {
  const products = useProducts();
  const cart = useCart(products.skus);
  const toast = useToast();
  const admin = useAdminSession();
  const [view, setView] = useState('shop');
  const [cartOpen, setCartOpen] = useState(false);

  // Go to the shop page and scroll to a section ('shop', 'bulk' or 'contact').
  const goTo = (sectionId) => {
    setView('shop');
    setTimeout(() => document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  const addToCart = (sku, qty) => {
    cart.add(sku.id, qty);
    toast.show(`Added ${sku.label} to cart`);
  };

  // Returns { orderId } or { error }. Stock is re-checked on the server.
  const placeOrder = async (customer) => {
    try {
      const result = await api.placeOrder(customer, cart.cart);
      products.refresh();
      return result;
    } catch (e) {
      products.refresh();
      return { error: e.message };
    }
  };

  return (
    <>
      <TopBar />
      <Header cartCount={cart.count} onGoTo={goTo} onNavigate={setView} onOpenCart={() => setCartOpen(true)} />

      {view === 'shop' && <StorePage products={products} onAddToCart={addToCart} onGoTo={goTo} />}
      {view === 'track' && <TrackOrder />}
      {view === 'admin' && (admin.session ? <AdminPortal admin={admin} /> : <LoginForm onLogin={admin.login} />)}

      <Footer />
      <WhatsAppButton />

      {cartOpen && (
        <CartDrawer skus={products.skus} cartApi={cart} onPlaceOrder={placeOrder} onClose={() => setCartOpen(false)} />
      )}
      {toast.message && <Toast message={toast.message} />}
    </>
  );
}
