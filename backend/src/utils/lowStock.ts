import { db, insertRow, nowIso } from "../models/store";
import type { Product } from "../models/schema";

// Creates a LOW_STOCK notification for a product, but only if there
// isn't already an unread one for it (per spec: "do not create
// duplicate alerts unnecessarily").
export async function checkLowStock(product: Product) {
  const isLow = product.current_stock <= product.minimum_stock;
  if (!isLow) return;

  const alreadyAlerted = db.notifications.some(
    (n) => n.product_id === product.id && n.type === "LOW_STOCK" && !n.is_read
  );
  if (alreadyAlerted) return;

  const row = {
    type: "LOW_STOCK" as const,
    product_id: product.id,
    message: `${product.name} is at ${product.current_stock} ${product.unit} (minimum ${product.minimum_stock})`,
    is_read: false,
    created_at: nowIso(),
  };
  const id = await insertRow("notifications", row);
  db.notifications.push({ id, ...row });
}
