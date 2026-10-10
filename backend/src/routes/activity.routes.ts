import { Router } from "express";
import { db } from "../models/store";
import { requireAuth, requireRole } from "../middleware/auth";

export const activityRouter = Router();
activityRouter.use(requireAuth);

// GET /api/activity?page=&pageSize= - visible to Admin and Manager only
activityRouter.get("/", requireRole("ADMIN", "MANAGER"), (req, res) => {
  const { page = "1", pageSize = "20" } = req.query as Record<string, string>;
  const sorted = [...db.activityLogs].sort((a, b) => b.id - a.id);

  const pageNum = Math.max(1, Number(page) || 1);
  const size = Math.max(1, Number(pageSize) || 20);
  const start = (pageNum - 1) * size;

  const withUserNames = sorted.slice(start, start + size).map((entry) => ({
    ...entry,
    userName: db.users.find((u) => u.id === entry.user_id)?.name || `User #${entry.user_id}`,
  }));

  res.json({
    success: true,
    activity: withUserNames,
    pagination: { page: pageNum, pageSize: size, total: sorted.length, totalPages: Math.ceil(sorted.length / size) || 1 },
  });
});
