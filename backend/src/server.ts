import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import express from "express";

// Load the repository-root .env (this file lives at backend/src/server.ts,
// so the root is two levels up).
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import { config } from "./config/env";
import { seedDatabase, DEMO_PASSWORD } from "./models/seed";
import { authRouter } from "./routes/auth.routes";
import { categoriesRouter } from "./routes/categories.routes";
import { productsRouter } from "./routes/products.routes";
import { suppliersRouter } from "./routes/suppliers.routes";
import { customersRouter } from "./routes/customers.routes";
import { purchasesRouter } from "./routes/purchases.routes";
import { salesRouter } from "./routes/sales.routes";
import { inventoryRouter } from "./routes/inventory.routes";
import { employeesRouter } from "./routes/employees.routes";
import { reportsRouter } from "./routes/reports.routes";
import { activityRouter } from "./routes/activity.routes";
import { notificationsRouter } from "./routes/notifications.routes";
import { dashboardRouter } from "./routes/dashboard.routes";

// Landing-page lead capture, unrelated to the inventory system below.
// Kept exactly as before so the marketing site's modals keep working.
let demoRequests: any[] = [];
let webinarRegistrations: any[] = [];

seedDatabase();

const app = express();

app.use(express.json());

// Basic CORS so the frontend (a separate Vite dev server) can call this
// API directly. In dev, frontend/vite.config.ts also proxies /api here,
// so this mostly matters if you ever hit the API from a different origin.
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", config.frontendUrl);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// ---- Health check --------------------------------------------------
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "MERKATO STOCK Backend API" });
});

// ---- Merkato Stock inventory system ---------------------------------
app.use("/api/auth", authRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/products", productsRouter);
app.use("/api/suppliers", suppliersRouter);
app.use("/api/customers", customersRouter);
app.use("/api/purchases", purchasesRouter);
app.use("/api/sales", salesRouter);
app.use("/api/inventory", inventoryRouter);
app.use("/api/employees", employeesRouter);
app.use("/api/reports", reportsRouter);
app.use("/api/activity", activityRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api/dashboard", dashboardRouter);

// Dev-only: restores the original Ethiopian seed data. Handy after
// poking around the demo - never expose something like this in production
// without locking it behind auth (see requireAuth/requireRole).
app.post("/api/dev/reset", (_req, res) => {
  seedDatabase();
  res.json({ success: true, message: "Demo data restored.", demoPassword: DEMO_PASSWORD });
});

// ---- Landing page lead capture (unchanged) ---------------------------
app.post("/api/leads/demo", (req, res) => {
  const { name, email, company, phone, preferredDate } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }
  const lead = {
    id: `demo-${Date.now()}`,
    name,
    email,
    company: company || "Not specified",
    phone: phone || "Not specified",
    preferredDate: preferredDate || new Date().toISOString().split("T")[0],
    createdAt: new Date().toISOString(),
  };
  demoRequests.push(lead);
  res.status(201).json({ success: true, message: "Demo scheduled successfully!", lead });
});

app.post("/api/leads/webinar", (req, res) => {
  const { name, email, country } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }
  const reg = {
    id: `webinar-${Date.now()}`,
    name: name || "Attendee",
    email,
    country: country || "Global",
    timeSlot: "3:00 PM IST (Weekday)",
    createdAt: new Date().toISOString(),
  };
  webinarRegistrations.push(reg);
  res.status(201).json({ success: true, message: "Webinar seat confirmed!", reg });
});

// ---- Production: optionally serve the built frontend ------------------
// In dev, the frontend runs on its own `vite` dev server (see
// frontend/vite.config.ts's proxy config) - this block is unused then.
// In production, point PORT/serving at frontend/dist if you want one
// process to serve both, or deploy the two independently.
if (config.nodeEnv === "production") {
  const distPath = path.resolve(__dirname, "../../frontend/dist");
  app.use(express.static(distPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(config.port, "0.0.0.0", () => {
  console.log(`MERKATO STOCK API running on http://localhost:${config.port}`);
  console.log(`Demo accounts (password: ${DEMO_PASSWORD}):`);
  console.log(`  Admin:    admin@merkatostock.com`);
  console.log(`  Manager:  manager@merkatostock.com`);
  console.log(`  Employee: employee@merkatostock.com`);
});
