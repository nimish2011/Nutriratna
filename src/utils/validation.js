/**
 * Validation shared by the website (instant feedback) and the server (the real gatekeeper).
 * Every field is REQUIRED. Each validate* function returns { ok, errors, clean }:
 *   errors — { fieldName: "message" }   clean — trimmed/normalised values safe to store
 */
import { BULK_PACKS, BUSINESS_TYPES } from '../config/constants.js';

const text = (v) => String(v ?? '').trim();
const between = (v, min, max) => v.length >= min && v.length <= max;

/** "+91 98765-43210", "09876543210" ... -> "9876543210" */
export function normalizePhone(value) {
  const digits = String(value ?? '').replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
  return digits;
}

export const isValidMobile = (v) => /^[6-9]\d{9}$/.test(normalizePhone(v)); // Indian 10-digit mobile
export const isValidPin = (v) => /^\d{6}$/.test(text(v));
export const isValidEmail = (v) => text(v).length <= 120 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(text(v));

/** Bulk / wholesale inquiry — all 9 fields required. */
export function validateInquiry(input = {}) {
  const f = {
    name: text(input.name),
    business: text(input.business),
    type: text(input.type),
    phone: normalizePhone(input.phone),
    email: text(input.email).toLowerCase(),
    qty: text(input.qty),
    pack: text(input.pack),
    city: text(input.city),
    message: text(input.message),
  };
  const errors = {};
  if (!between(f.name, 2, 80)) errors.name = 'Enter your name (2–80 characters)';
  if (!between(f.business, 2, 120)) errors.business = 'Enter your business name';
  if (!BUSINESS_TYPES.includes(f.type)) errors.type = 'Select a business type';
  if (!isValidMobile(f.phone)) errors.phone = 'Enter a valid 10-digit Indian mobile number';
  if (!isValidEmail(f.email)) errors.email = 'Enter a valid email address';
  const qty = Number(f.qty);
  if (!f.qty || !Number.isInteger(qty) || qty < 1 || qty > 1000000) errors.qty = 'Enter a whole number of kg (1 or more)';
  if (!BULK_PACKS.includes(f.pack)) errors.pack = 'Select a pack';
  if (!between(f.city, 2, 100)) errors.city = 'Enter the delivery city / state';
  if (!between(f.message, 10, 1000)) errors.message = 'Tell us your requirements (at least 10 characters)';
  return { ok: !Object.keys(errors).length, errors, clean: { ...f, qty } };
}

/** Checkout shipping details — all fields required. */
export function validateCustomer(input = {}) {
  const f = {
    name: text(input.name),
    phone: normalizePhone(input.phone),
    email: text(input.email).toLowerCase(),
    address: text(input.address),
    city: text(input.city),
    pin: text(input.pin),
  };
  const errors = {};
  if (!between(f.name, 2, 80)) errors.name = 'Enter your full name';
  if (!isValidMobile(f.phone)) errors.phone = 'Enter a valid 10-digit Indian mobile number';
  if (!isValidEmail(f.email)) errors.email = 'Enter a valid email address';
  if (!between(f.address, 5, 300)) errors.address = 'Enter your full address';
  if (!between(f.city, 2, 100)) errors.city = 'Enter your city';
  if (!isValidPin(f.pin)) errors.pin = 'Enter a valid 6-digit PIN code';
  return { ok: !Object.keys(errors).length, errors, clean: f };
}
