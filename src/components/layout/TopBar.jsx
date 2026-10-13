import { CONTACT } from '../../config/constants';

/** Thin contact strip above the header. */
export default function TopBar() {
  return (
    <div className="topbar">
      <div className="wrap">
        <a href={`tel:${CONTACT.phoneTel}`}>📞 {CONTACT.phoneDisplay}</a>
        <a href={`mailto:${CONTACT.email}`}>✉ {CONTACT.email}</a>
      </div>
    </div>
  );
}
