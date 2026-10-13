import { CONTACT } from '../../config/constants';
import { whatsappLink } from '../../utils/contact';

/** "Talk to us" cards: call, WhatsApp, email. */
export default function ContactSection() {
  return (
    <section id="contact">
      <div className="wrap">
        <div className="sh">
          <h2>Talk to us</h2>
          <p>Questions about orders, packs or bulk pricing? We reply on WhatsApp and email.</p>
        </div>
        <div className="feat">
          <a className="card contact-card" href={`tel:${CONTACT.phoneTel}`}>
            <div className="ic">📞</div><h3>Call us</h3><p className="mut">{CONTACT.phoneDisplay}</p>
          </a>
          <a className="card contact-card" href={whatsappLink(null, 'Hello NutriRatna!')} target="_blank" rel="noopener noreferrer">
            <div className="ic">💬</div><h3>WhatsApp</h3><p className="mut">{CONTACT.phoneDisplay}</p>
          </a>
          <a className="card contact-card" href={`mailto:${CONTACT.email}`}>
            <div className="ic">✉️</div><h3>Email</h3><p className="mut">{CONTACT.email}</p>
          </a>
        </div>
      </div>
    </section>
  );
}
