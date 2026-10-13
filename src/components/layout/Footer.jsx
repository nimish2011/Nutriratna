import { CONTACT } from '../../config/constants';
import { whatsappLink } from '../../utils/contact';

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="serif footer-brand">NutriRatna</div>
        <p className="footer-tag">Gem of the Mother Nature</p>
        <div className="footer-links">
          <a href={`tel:${CONTACT.phoneTel}`}>📞 {CONTACT.phoneDisplay}</a>
          <a href={whatsappLink(null)} target="_blank" rel="noopener noreferrer">💬 WhatsApp</a>
          <a href={`mailto:${CONTACT.email}`}>✉ {CONTACT.email}</a>
        </div>
        © 2026 NutriRatna · India
      </div>
    </footer>
  );
}
