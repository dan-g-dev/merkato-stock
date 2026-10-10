import { Router } from "express";
import { db, updateRow } from "../models/store";
import { pool } from "../config/db";
import { requireAuth } from "../middleware/auth";

export const notificationsRouter = Router();
notificationsRouter.use(requireAuth);

// GET /api/notifications - unread first, newest first
notificationsRouter.get("/", (_req, res) => {
  const sorted = [...db.notifications].sort((a, b) => Number(a.is_read) - Number(b.is_read) || b.id - a.id);
  res.json({ success: true, notifications: sorted, unreadCount: db.notifications.filter((n) => !n.is_read).length });
});

// PUT /api/notifications/:id/read
notificationsRouter.put("/:id/read", async (req, res) => {
  const notification = db.notifications.find((n) => n.id === Number(req.params.id));
  if (!notification) return res.status(404).json({ success: false, message: "Notification not found." });
  notification.is_read = true;
  await updateRow("notifications", notification.id, { is_read: true });
  res.json({ success: true, notification });
});

// PUT /api/notifications/read-all
notificationsRouter.put("/read-all", async (_req, res) => {
  for (const n of db.notifications) n.is_read = true;
  await pool.query("UPDATE notifications SET is_read = TRUE WHERE is_read = FALSE");
  res.json({ success: true });
});
