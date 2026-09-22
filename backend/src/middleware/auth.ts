import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/token";
import { db } from "../models/store";
import type { Role, User } from "../models/schema";

// Augment Express's Request type so `req.user` is recognized everywhere.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

// Reads the "Authorization: Bearer <token>" header, verifies it, and
// loads the matching user onto req.user. Rejects the request if the
// token is missing/invalid/expired, or the user was deactivated.
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice("Bearer ".length) : null;

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authenticated." });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ success: false, message: "Session expired. Please sign in again." });
  }

  const user = db.users.find((u) => u.id === payload.userId);
  if (!user || user.status !== "ACTIVE") {
    return res.status(401).json({ success: false, message: "Account not found or deactivated." });
  }

  req.user = user;
  next();
}

// Restricts a route to specific roles. Always used *in addition to*
// requireAuth, never instead of it - the frontend hiding a button is
// not enough on its own.
export function requireRole(...allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "You don't have permission to do that." });
    }
    next();
  };
}
