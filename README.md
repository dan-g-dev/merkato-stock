# MERKATO STOCK

**Smart Inventory Management for Ethiopian Businesses**

A full-stack inventory management system for retail shops, supermarkets,
pharmacies, coffee businesses, and other small/medium Ethiopian businesses.
Currency is ETB throughout, and the seed data uses real Ethiopian products,
suppliers, and locations.

The public marketing site (everything under `frontend/src/components/landing/`)
is a separate, untouched layer in front of the actual product: a working
dashboard with authentication, role-based access, and real inventory
business logic behind it.

## Features

- **Auth & RBAC** - register/login with JWT-style tokens, three roles
  (Admin, Manager, Employee), enforced on the backend, not just hidden UI.
- **Dashboard** - live KPIs (inventory value, sales, low stock, etc.) and
  charts, computed from real data, never hardcoded.
- **Products** - full CRUD with SKU/barcode uniqueness, search, category
  and stock-level filters, sorting, and pagination.
- **Categories & Suppliers** - CRUD, with a supplier profile showing
  purchase history and total spend.
- **Customers** - CRUD, with a profile showing purchase history.
- **Purchase Orders** - draft/submit a PO, then "Receive" it to add stock
  and write inventory transactions atomically.
- **Sales** - a stock-aware sale flow (can't oversell), invoice numbering,
  a printable receipt, and per-line profit tracking.
- **Inventory** - every stock change (purchase, sale, manual adjustment)
  is recorded as an `inventory_transactions` row; manual stock adjustments
  are supported for Admin/Manager.
- **Low-stock alerts** - notifications generated automatically, without
  duplicates, whenever `current_stock <= minimum_stock`.
- **Employees** - Admin-only staff management: add, change role,
  activate/deactivate, view individual activity.
- **Activity Log** - an audit trail of who did what.
- **Reports** - sales, purchases, inventory, profit, low stock, and
  employee-sales reports, with date filters and CSV export.
- **Receipts** - a print-friendly receipt (use the browser's "Save as PDF"
  in the print dialog - see "Design choices" below for why).

## Tech stack

- **Frontend**: React 19, Vite 6, Tailwind CSS 4, TypeScript
- **Backend**: Express, TypeScript, Node's built-in `crypto` for password
  hashing and signed auth tokens (no external auth libraries)
- **Database**: an in-memory store today (`backend/src/models/`), shaped
  exactly like `database/schema.sql`, so moving to real MySQL later is a
  matter of swapping the store for a query layer, not rewriting routes.

## Project structure

```
merkato-stock/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── landing/      # Marketing site - untouched
│   │   │   ├── modals/       # AuthModal, wired to real auth
│   │   │   └── dashboard/    # The actual product
│   │   │       ├── pages/    # One file per dashboard page
│   │   │       └── ui/       # Shared building blocks
│   │   ├── context/          # AuthContext
│   │   ├── services/         # Fetch-based API client
│   │   ├── utils/            # Currency/date formatting
│   │   └── types.ts
│   ├── package.json
│   ├── vite.config.ts        # Proxies /api to the backend in dev
│   └── .gitignore
│
├── backend/
│   ├── src/
│   │   ├── routes/           # One file per feature - route + handler
│   │   │                     #   logic combined, no separate controller
│   │   │                     #   layer (see "Design choices" below)
│   │   ├── middleware/       # requireAuth / requireRole
│   │   ├── models/           # Row types, in-memory store, seed data
│   │   ├── utils/            # password hashing, tokens, CSV, low-stock, ...
│   │   ├── config/           # Central env var access
│   │   └── server.ts         # Express entry point
│   ├── package.json
│   └── .gitignore
│
├── database/
│   ├── schema.sql            # Full MySQL schema for a real deployment
│   └── seed.sql              # Matching Ethiopian seed data
│
├── .env.example               # Shared - backend reads this from the root
└── .gitignore
```

## Installation

Frontend and backend are two separate Node projects - install each one:

```bash
cd backend && npm install
cd ../frontend && npm install
```

## Environment variables

Copy `.env.example` (at the repo root) to `.env` and fill in real values
(at minimum, set a random `JWT_SECRET`). The backend loads this file from
the root regardless of which folder you run it from. See the comments in
`.env.example` for what each variable does, including the MySQL and
Telebirr variables that are unused today but documented for a real
deployment.

## Database setup (for a real MySQL deployment)

The app runs on an in-memory store out of the box - no database setup
needed for local development. When you're ready to move to MySQL:

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

Then implement a `mysql2`-based query layer with the same function
signatures as `backend/src/models/store.ts` and swap it in - the route
files were written to keep all data access in one place, so they
shouldn't need to change much.

## Running the app

You need **two terminals** - one for the API, one for the site:

```bash
# Terminal 1
cd backend && npm run dev
# -> API on http://localhost:3000

# Terminal 2
cd frontend && npm run dev
# -> Site on http://localhost:5173
```

Open `http://localhost:5173`. The frontend's Vite dev server proxies every
`/api/...` request to the backend automatically (see
`frontend/vite.config.ts`), so the site and the API behave as one app even
though they're two processes.

### Production build

```bash
cd frontend && npm run build   # outputs frontend/dist
cd ../backend && npm run build && NODE_ENV=production npm start
```

With `NODE_ENV=production`, the backend also serves `frontend/dist`
directly, so a single `backend` process can serve the whole app. You can
just as easily deploy the two independently (e.g. static hosting for
`frontend/dist`, a Node host for `backend`) - set `BACKEND_URL` for the
frontend build and `FRONTEND_URL` for the backend's CORS header if you do.

## Demo accounts

Password for all three: `Password123!` **(development only - change
before any real use)**

| Role     | Email                       |
|----------|------------------------------|
| Admin    | admin@merkatostock.com      |
| Manager  | manager@merkatostock.com    |
| Employee | employee@merkatostock.com   |

You can also sign in from the landing page ("Sign In" or any "Try Demo"
button) and use the three quick-login buttons, or hit
`POST /api/dev/reset` to restore the original seed data at any time.

## Design choices worth knowing about

- **No separate controller/service/model layers**: each backend route file
  under `backend/src/routes/` combines the route definition and its
  handler logic directly - there's no extra controller-calls-service
  indirection. This matches the "avoid unnecessary abstraction, keep it
  understandable" brief; `backend/src/models/` covers the data-model side.
- **Password hashing & tokens**: uses Node's built-in `crypto` (scrypt for
  passwords, HMAC-signed tokens) instead of `bcrypt`/`jsonwebtoken`, so the
  project needs zero extra installs to run. Swapping in the real packages
  later is a two-function change - see the comments in
  `backend/src/utils/password.ts` and `backend/src/utils/token.ts`.
- **Charts**: small dependency-free SVG bar/line charts
  (`frontend/src/components/dashboard/ui/Charts.tsx`) instead of Recharts,
  per the spec's own "don't add a library without a reason" guidance. Swap
  in Recharts any time - the chart data shapes already match what it
  expects.
- **PDF export**: the sales receipt uses the browser's print dialog
  ("Save as PDF") instead of a PDF-generation library. Reports currently
  export to CSV, which was explicitly required; a proper PDF report
  generator (e.g. `npm install pdfkit` in `backend/`) is a reasonable next
  step.
- **Telebirr**: recorded as a payment method on sales, but per the spec,
  there's no real payment verification. `TELEBIRR_APP_ID` etc. are in
  `.env.example`, unused, waiting for real merchant credentials.

## Future improvements

- Wire up a real MySQL connection using `database/schema.sql` and drop the
  in-memory store.
- Real bcrypt/JWT libraries if you want the industry-standard
  implementations instead of the crypto-based equivalents.
- A real PDF report generator for the Reports page (CSV export already
  works today).
- Camera-based barcode scanning in the New Sale flow (barcode search by
  typed value already works via the Products search box).
- Recharts (or another charting library) for richer dashboard charts.
