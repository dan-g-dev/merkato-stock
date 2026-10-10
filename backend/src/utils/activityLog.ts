import { db, insertRow, nowIso } from "../models/store";

// Records one row in the activity_logs table. Call this (with await)
// after any meaningful write (create/update/delete/receive/sell) so
// the Activity History page has something to show.
export async function logActivity(params: {
  userId: number;
  action: string;
  entityType: string;
  entityId?: number | null;
  description: string;
}) {
  const row = {
    user_id: params.userId,
    action: params.action,
    entity_type: params.entityType,
    entity_id: params.entityId ?? null,
    description: params.description,
    created_at: nowIso(),
  };
  const id = await insertRow("activity_logs", row);
  db.activityLogs.push({ id, ...row });
}
