import { Router } from "express";
import { db, insertRow, updateRow, deleteRow, nowIso } from "../models/store";
import { requireAuth, requireRole } from "../middleware/auth";
import { logActivity } from "../utils/activityLog";

export const suppliersRouter = Router();
suppliersRouter.use(requireAuth);

// GET /api/suppliers
suppliersRouter.get("/", (_req, res) => {
  res.json({ success: true, suppliers: db.suppliers });
});

// GET /api/suppliers/:id  - profile with purchase history + total purchases
suppliersRouter.get("/:id", (req, res) => {
  const supplier = db.suppliers.find((s) => s.id === Number(req.params.id));
  if (!supplier) return res.status(404).json({ success: false, message: "Supplier not found." });

  const purchaseOrders = db.purchaseOrders.filter((po) => po.supplier_id === supplier.id);
  const totalPurchases = purchaseOrders
    .filter((po) => po.status === "RECEIVED")
    .reduce((sum, po) => sum + po.total, 0);

  res.json({ success: true, supplier, purchaseOrders, totalPurchases });
});

// POST /api/suppliers
suppliersRouter.post("/", requireRole("ADMIN", "MANAGER"), async (req, res) => {
  const { company_name, contact_person, phone, email, address, city, notes } = req.body || {};
  if (!company_name) return res.status(400).json({ success: false, message: "Company name is required." });

  const row = {
    company_name: String(company_name),
    contact_person: contact_person || null,
    phone: phone || null,
    email: email || null,
    address: address || null,
    city: city || null,
    notes: notes || null,
    status: "ACTIVE" as const,
    created_at: nowIso(),
  };
  const id = await insertRow("suppliers", row);
  const supplier = { id, ...row };
  db.suppliers.push(supplier);
  await logActivity({ userId: req.user!.id, action: "CREATED_SUPPLIER", entityType: "supplier", entityId: supplier.id, description: `${req.user!.name} added supplier "${supplier.company_name}"` });
  res.status(201).json({ success: true, supplier });
});

// PUT /api/suppliers/:id
suppliersRouter.put("/:id", requireRole("ADMIN", "MANAGER"), async (req, res) => {
  const supplier = db.suppliers.find((s) => s.id === Number(req.params.id));
  if (!supplier) return res.status(404).json({ success: false, message: "Supplier not found." });

  const { id: _ignored, ...changes } = req.body || {};
  Object.assign(supplier, changes, { id: supplier.id });
  await updateRow("suppliers", supplier.id, changes);

  await logActivity({ userId: req.user!.id, action: "UPDATED_SUPPLIER", entityType: "supplier", entityId: supplier.id, description: `${req.user!.name} updated supplier "${supplier.company_name}"` });
  res.json({ success: true, supplier });
});

// DELETE /api/suppliers/:id
suppliersRouter.delete("/:id", requireRole("ADMIN", "MANAGER"), async (req, res) => {
  const index = db.suppliers.findIndex((s) => s.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ success: false, message: "Supplier not found." });

  const [removed] = db.suppliers.splice(index, 1);
  await deleteRow("suppliers", removed.id);
  await logActivity({ userId: req.user!.id, action: "DELETED_SUPPLIER", entityType: "supplier", entityId: removed.id, description: `${req.user!.name} deleted supplier "${removed.company_name}"` });
  res.json({ success: true });
});
