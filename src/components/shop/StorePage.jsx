import Hero from './Hero';
import ProductGrid from './ProductGrid';
import Features from './Features';
import ContactSection from './ContactSection';
import BulkInquiry from '../bulk/BulkInquiry';

/** The public home page: hero, products, benefits, wholesale form, contact. */
export default function StorePage({ products, onAddToCart, onGoTo }) {
  return (
    <>
      <Hero onGoTo={onGoTo} />
      <ProductGrid products={products} onAddToCart={onAddToCart} />
      <Features />
      <BulkInquiry />
      <ContactSection />
    </>
  );
}
