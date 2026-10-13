import { CONTACT } from '../config/constants';

/** wa.me link that opens WhatsApp. `phone` is a 10-digit Indian number or omitted for the business number. */
export const whatsappLink = (phone, message = '') => {
  const number = phone ? `91${phone}` : CONTACT.whatsappNumber;
  return `https://wa.me/${number}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
};

export const mailtoLink = (email, subject = '', body = '') =>
  `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
