import { Router } from "express";
import { db, insertRow, updateRow, deleteRow, nowIso } from "../models/store";
import { requireAuth, requireRole } from "../middleware/auth";
import { logActivity } from "../utils/activityLog";

export const categoriesRouter = Router();
categoriesRouter.use(requireAuth);

// GET /api/categories
categoriesRouter.get("/", (_req, res) => {
  res.json({ success: true, categories: db.categories });
});

// POST /api/categories
categoriesRouter.post("/", requireRole("ADMIN", "MANAGER"), async (req, res) => {
  const { name, description } = req.body || {};
  if (!name) return res.status(400).json({ success: false, message: "Category name is required." });
  if (db.categories.some((c) => c.name.toLowerCase() === String(name).toLowerCase())) {
    return res.status(409).json({ success: false, message: "A category with that name already exists." });
  }

  const row = { name: String(name), description: description || null, status: "ACTIVE" as const, created_at: nowIso() };
  const id = await insertRow("categories", row);
  const category = { id, ...row };
  db.categories.push(category);
  await logActivity({ userId: req.user!.id, action: "CREATED_CATEGORY", entityType: "category", entityId: category.id, description: `${req.user!.name} created category "${category.name}"` });
  res.status(201).json({ success: true, category });
});

// PUT /api/categories/:id
categoriesRouter.put("/:id", requireRole("ADMIN", "MANAGER"), async (req, res) => {
  const category = db.categories.find((c) => c.id === Number(req.params.id));
  if (!category) return res.status(404).json({ success: false, message: "Category not found." });

  const { name, description, status } = req.body || {};
  const changes: Record<string, any> = {};
  if (name) { category.name = String(name); changes.name = category.name; }
  if (description !== undefined) { category.description = description; changes.description = description; }
  if (status) { category.status = status; changes.status = status; }
  await updateRow("categories", category.id, changes);

  await logActivity({ userId: req.user!.id, action: "UPDATED_CATEGORY", entityType: "category", entityId: category.id, description: `${req.user!.name} updated category "${category.name}"` });
  res.json({ success: true, category });
});

// DELETE /api/categories/:id
categoriesRouter.delete("/:id", requireRole("ADMIN", "MANAGER"), async (req, res) => {
  const index = db.categories.findIndex((c) => c.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ success: false, message: "Category not found." });

  const inUse = db.products.some((p) => p.category_id === db.categories[index].id);
  if (inUse) {
    return res.status(409).json({ success: false, message: "Can't delete a category that still has products in it." });
  }

  const [removed] = db.categories.splice(index, 1);
  await deleteRow("categories", removed.id);
  await logActivity({ userId: req.user!.id, action: "DELETED_CATEGORY", entityType: "category", entityId: removed.id, description: `${req.user!.name} deleted category "${removed.name}"` });
  res.json({ success: true });
});
