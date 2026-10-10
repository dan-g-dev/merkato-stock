import { Router } from "express";
import { db, insertRow, updateRow, deleteRow, nowIso } from "../models/store";
import { requireAuth } from "../middleware/auth";
import { logActivity } from "../utils/activityLog";

export const customersRouter = Router();
customersRouter.use(requireAuth);

// GET /api/customers?search=
customersRouter.get("/", (req, res) => {
  const search = String(req.query.search || "").toLowerCase();
  let customers = db.customers;
  if (search) {
    customers = customers.filter(
      (c) => c.name.toLowerCase().includes(search) || (c.phone || "").includes(search) || (c.email || "").toLowerCase().includes(search)
    );
  }
  res.json({ success: true, customers });
});

// GET /api/customers/:id - profile with purchase history
customersRouter.get("/:id", (req, res) => {
  const customer = db.customers.find((c) => c.id === Number(req.params.id));
  if (!customer) return res.status(404).json({ success: false, message: "Customer not found." });

  const sales = db.sales.filter((s) => s.customer_id === customer.id);
  const totalSpent = sales.reduce((sum, s) => sum + s.total, 0);

  res.json({ success: true, customer, sales, totalSpent, orderCount: sales.length });
});

// POST /api/customers
customersRouter.post("/", async (req, res) => {
  const { name, phone, email, address, city, notes } = req.body || {};
  if (!name) return res.status(400).json({ success: false, message: "Customer name is required." });

  const row = {
    name: String(name),
    phone: phone || null,
    email: email || null,
    address: address || null,
    city: city || null,
    notes: notes || null,
    created_at: nowIso(),
  };
  const id = await insertRow("customers", row);
  const customer = { id, ...row };
  db.customers.push(customer);
  await logActivity({ userId: req.user!.id, action: "CREATED_CUSTOMER", entityType: "customer", entityId: customer.id, description: `${req.user!.name} added customer "${customer.name}"` });
  res.status(201).json({ success: true, customer });
});

// PUT /api/customers/:id
customersRouter.put("/:id", async (req, res) => {
  const customer = db.customers.find((c) => c.id === Number(req.params.id));
  if (!customer) return res.status(404).json({ success: false, message: "Customer not found." });

  const { id: _ignored, ...changes } = req.body || {};
  Object.assign(customer, changes, { id: customer.id });
  await updateRow("customers", customer.id, changes);

  await logActivity({ userId: req.user!.id, action: "UPDATED_CUSTOMER", entityType: "customer", entityId: customer.id, description: `${req.user!.name} updated customer "${customer.name}"` });
  res.json({ success: true, customer });
});

// DELETE /api/customers/:id
customersRouter.delete("/:id", async (req, res) => {
  const index = db.customers.findIndex((c) => c.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ success: false, message: "Customer not found." });

  const [removed] = db.customers.splice(index, 1);
  await deleteRow("customers", removed.id);
  await logActivity({ userId: req.user!.id, action: "DELETED_CUSTOMER", entityType: "customer", entityId: removed.id, description: `${req.user!.name} deleted customer "${removed.name}"` });
  res.json({ success: true });
});
