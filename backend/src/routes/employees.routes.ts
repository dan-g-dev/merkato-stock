import { Router } from "express";
import { db, nextId, nowIso } from "../models/store";
import { requireAuth, requireRole } from "../middleware/auth";
import { hashPassword } from "../utils/password";
import { logActivity } from "../utils/activityLog";

export const employeesRouter = Router();
employeesRouter.use(requireAuth);

function publicUser(user: (typeof db.users)[number]) {
  const { password_hash, ...rest } = user;
  return rest;
}

// GET /api/employees - Admin and Manager can view the team
employeesRouter.get("/", requireRole("ADMIN", "MANAGER"), (_req, res) => {
  res.json({ success: true, employees: db.users.map(publicUser) });
});

// GET /api/employees/:id/activity - what this employee has been doing
employeesRouter.get("/:id/activity", requireRole("ADMIN", "MANAGER"), (req, res) => {
  const userId = Number(req.params.id);
  const activity = db.activityLogs.filter((a) => a.user_id === userId).sort((a, b) => b.id - a.id);
  const sales = db.sales.filter((s) => s.employee_id === userId);
  res.json({ success: true, activity, salesCount: sales.length, salesTotal: sales.reduce((sum, s) => sum + s.total, 0) });
});

// POST /api/employees - only ADMIN can add staff and set their role
employeesRouter.post("/", requireRole("ADMIN"), (req, res) => {
  const { name, email, phone, password, role } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Name, email and password are required." });
  }
  if (db.users.some((u) => u.email.toLowerCase() === String(email).toLowerCase())) {
    return res.status(409).json({ success: false, message: "An account with that email already exists." });
  }
  if (!["ADMIN", "MANAGER", "EMPLOYEE"].includes(role)) {
    return res.status(400).json({ success: false, message: "Role must be ADMIN, MANAGER or EMPLOYEE." });
  }

  const now = nowIso();
  const user = {
    id: nextId("users"),
    name: String(name),
    email: String(email),
    phone: phone || null,
    password_hash: hashPassword(String(password)),
    role,
    status: "ACTIVE" as const,
    created_at: now,
    updated_at: now,
  };
  db.users.push(user);
  logActivity({ userId: req.user!.id, action: "CREATED_EMPLOYEE", entityType: "user", entityId: user.id, description: `${req.user!.name} added ${user.name} as ${user.role}` });
  res.status(201).json({ success: true, employee: publicUser(user) });
});

// PUT /api/employees/:id - edit details, change role, activate/deactivate
employeesRouter.put("/:id", requireRole("ADMIN"), (req, res) => {
  const user = db.users.find((u) => u.id === Number(req.params.id));
  if (!user) return res.status(404).json({ success: false, message: "Employee not found." });

  const { name, phone, role, status } = req.body || {};
  if (name) user.name = String(name);
  if (phone !== undefined) user.phone = phone;
  if (role && ["ADMIN", "MANAGER", "EMPLOYEE"].includes(role)) user.role = role;
  if (status && ["ACTIVE", "INACTIVE"].includes(status)) user.status = status;
  user.updated_at = nowIso();

  logActivity({ userId: req.user!.id, action: "UPDATED_EMPLOYEE", entityType: "user", entityId: user.id, description: `${req.user!.name} updated ${user.name}'s account` });
  res.json({ success: true, employee: publicUser(user) });
});
