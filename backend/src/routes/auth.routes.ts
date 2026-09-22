import { Router } from "express";
import { db, nextId, nowIso } from "../models/store";
import { hashPassword, verifyPassword } from "../utils/password";
import { signToken } from "../utils/token";
import { requireAuth } from "../middleware/auth";
import { logActivity } from "../utils/activityLog";

export const authRouter = Router();

function publicUser(user: (typeof db.users)[number]) {
  const { password_hash, ...rest } = user;
  return rest;
}

// POST /api/auth/register
// Anyone can self-register, but they always come in as EMPLOYEE.
// Only an ADMIN can promote someone afterwards (see employees.routes.ts).
authRouter.post("/register", (req, res) => {
  const { name, email, phone, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Name, email and password are required." });
  }
  if (String(password).length < 8) {
    return res.status(400).json({ success: false, message: "Password must be at least 8 characters." });
  }
  const emailTaken = db.users.some((u) => u.email.toLowerCase() === String(email).toLowerCase());
  if (emailTaken) {
    return res.status(409).json({ success: false, message: "An account with that email already exists." });
  }

  const now = nowIso();
  const user = {
    id: nextId("users"),
    name: String(name),
    email: String(email),
    phone: phone ? String(phone) : null,
    password_hash: hashPassword(String(password)),
    role: "EMPLOYEE" as const,
    status: "ACTIVE" as const,
    created_at: now,
    updated_at: now,
  };
  db.users.push(user);
  logActivity({ userId: user.id, action: "REGISTERED", entityType: "user", entityId: user.id, description: `${user.name} created an account` });

  const token = signToken(user.id, user.role);
  res.status(201).json({ success: true, token, user: publicUser(user) });
});

// POST /api/auth/login
authRouter.post("/login", (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required." });
  }

  const user = db.users.find((u) => u.email.toLowerCase() === String(email).toLowerCase());
  if (!user || !verifyPassword(String(password), user.password_hash)) {
    return res.status(401).json({ success: false, message: "Invalid email or password." });
  }
  if (user.status !== "ACTIVE") {
    return res.status(403).json({ success: false, message: "This account has been deactivated." });
  }

  const token = signToken(user.id, user.role);
  res.json({ success: true, token, user: publicUser(user) });
});

// GET /api/auth/me
authRouter.get("/me", requireAuth, (req, res) => {
  res.json({ success: true, user: publicUser(req.user!) });
});
