import React, { useEffect, useState } from "react";
import { api } from "../../../services/api";
import { formatDateTime } from "../../../utils/format";
import { LoadingSpinner, EmptyState, ErrorState, Pagination } from "../ui/Ui";
import type { ActivityLogEntry, Pagination as PaginationType } from "../../../types";

export const ActivityLogPage: React.FC = () => {
  const [entries, setEntries] = useState<ActivityLogEntry[]>([]);
  const [pagination, setPagination] = useState<PaginationType | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    api
      .get(`/activity?page=${page}&pageSize=20`)
      .then((res) => { setEntries(res.activity); setPagination(res.pagination); setError(null); })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [page]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
        {isLoading ? <LoadingSpinner /> : error ? <ErrorState message={error} /> : entries.length === 0 ? (
          <EmptyState message="No activity recorded yet." />
        ) : (
          <div className="divide-y divide-zinc-50 dark:divide-zinc-800/60">
            {entries.map((entry) => (
              <div key={entry.id} className="px-4 py-3 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold">{entry.description}</p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">{entry.action} · {entry.entity_type}{entry.entity_id ? ` #${entry.entity_id}` : ""}</p>
                </div>
                <span className="text-[11px] text-zinc-400 whitespace-nowrap">{formatDateTime(entry.created_at)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {pagination && <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />}
    </div>
  );
};
