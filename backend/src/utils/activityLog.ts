import { db, nextId, nowIso } from "../models/store";

// Records one row in the activity_logs table. Call this after any
// meaningful write (create/update/delete/receive/sell) so the
// Activity History page has something to show.
export function logActivity(params: {
  userId: number;
  action: string;
  entityType: string;
  entityId?: number | null;
  description: string;
}) {
  db.activityLogs.push({
    id: nextId("activityLogs"),
    user_id: params.userId,
    action: params.action,
    entity_type: params.entityType,
    entity_id: params.entityId ?? null,
    description: params.description,
    created_at: nowIso(),
  });
}
