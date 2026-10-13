# NutriRatna — Storefront + Admin Portal (React + Node)

Customer website (250 g – 10 kg packs, cart, order tracking, bulk/wholesale inquiry, contact details) and a
password-protected admin portal. Orders and customer queries are saved **on the server**, so the admin sees
them from any device after signing in. No online payment for now: the team confirms each order by WhatsApp/phone.

Business contact shown on the site: **portricglobal@gmail.com · +91 93112 86008** (edit in `src/config/constants.js` → `CONTACT`).

## 1. Setup (needs Node.js 18+)
    npm install
    cp .env.example .env        # then open .env and set ADMIN_PASSWORD (and optionally EXEC_PASSWORD, SESSION_SECRET)

## 2. Run while developing
    npm run dev                 # website on http://localhost:5173, API on :3001

## 3. Run for real (one server serves website + API)
    npm run build
    npm start                   # http://localhost:3001  (set PORT in .env to change)

## Admin login
- Open the site → **Admin** → sign in with `ADMIN_USERNAME` / `ADMIN_PASSWORD` from your `.env`.
- **Admin** sees everything: Dashboard, Orders, Inquiries, Inventory (prices, stock), Audit log.
- **Executive** (`EXEC_USERNAME` / `EXEC_PASSWORD`, optional) sees Dashboard, Orders, Inquiries only.
- Inquiries tab: every query customers send (all fields required), with one-click **WhatsApp** and **Email** reply buttons and a status (New → Contacted → Quoted → Won/Lost). New ones are highlighted and counted on the tab. The list refreshes every 30 s.
- The server will not start without an `ADMIN_PASSWORD` (8+ characters). There are no default passwords.

## Deploying
The site now needs a **Node.js host** (not just static hosting): Render, Railway, Fly.io, a VPS, etc.
- Build command: `npm install && npm run build` — Start command: `npm start`
- Set the environment variables from `.env.example` in the host's dashboard (never commit `.env`).
- **Important — data persistence:** orders/inquiries are saved in a file (`DATA_FILE`, default `data/db.json`).
  Hosts with temporary disks (e.g. Render free tier) will erase it on redeploy. Attach a persistent disk and point `DATA_FILE` to it
  (e.g. `/var/data/db.json`), and take regular backups. For larger scale, replace `server/db.js` with PostgreSQL/MySQL (only `getDB`/`saveDB` change).
- Put the site behind HTTPS (all hosts above provide it).

## What is enforced on the server (not just in the browser)
- All query-form fields required; name, 10-digit Indian mobile, email, quantity, pack, type, city and a message of 10+ chars are validated.
- All checkout fields required. Prices and stock always come from the server; stock is re-checked inside the order (no overselling).
- Admin routes need a signed login token; Admin-only routes (prices, stock, audit log) reject Executives.
- Rate limits on login, orders, inquiries and tracking; hidden spam-trap field; security headers (helmet/CSP); request size limits.
- Order tracking needs order ID **and** the mobile number used on the order.
- Audit log records price/stock/status changes with the user name.

## Project structure
    server/
      index.js            Express app: security headers, API routes, serves dist/
      routes-public.js    products, place order, track order, submit inquiry
      routes-admin.js     login, view data, change status/stock/price (token required)
      auth.js             accounts from .env, signed session tokens, role check
      db.js               JSON-file storage (swap for a real database later)
    src/
      config/constants.js CONTACT details, prices & starting stock, statuses, shipping rules
      utils/              format, validation (shared with the server), cart totals, contact links
      state/dbActions.js  business rules as pure functions (used by the server)
      services/api.js     every call from the website to the server
      hooks/              useProducts, useCart, useAdminSession, useToast
      components/         layout, shop, cart, bulk, track, admin, common
      styles/             tokens, base, layout, shop, cart, admin, responsive

## How to change things
| I want to…                                  | Edit                                                     |
|---------------------------------------------|----------------------------------------------------------|
| Change phone / email shown on the site      | `src/config/constants.js` → `CONTACT`                    |
| Set real prices / stock                     | Admin → Inventory (type the exact stock number or edit the price). Stock starts at **0**, so every pack shows "Out of stock" until you add stock. `SEED_DB` in constants.js only matters for a brand-new `data/db.json`. |
| Change shipping fee / free-shipping limit   | `src/config/constants.js`                                |
| Change colours / fonts                      | `src/styles/tokens.css`                                  |
| Change which fields the query form requires | `validateInquiry` in `src/utils/validation.js` (applies to browser + server) |
| Change order / stock rules                  | `src/state/dbActions.js`                                 |

## Backups & reset
`data/db.json` holds everything. Copy it to back up; delete it (with the server stopped) to reset to the starting data.

## Still to add later
Online payment gateway (Razorpay etc.), email/SMS/WhatsApp auto-notifications, shipping integration, coupons, a real database.
