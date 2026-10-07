import React from "react";

export default function Pagination({
  page = 0,
  totalPages = 0,
  totalElements = 0,
  pageSize = 10,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

  const go = (p) => {
    if (p < 0 || p >= totalPages || p === page) return;
    onPageChange?.(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const buildPages = () => {
    const delta = 1;
    const range = [];
    const left = Math.max(0, page - delta);
    const right = Math.min(totalPages - 1, page + delta);

    if (left > 0) range.push(0);
    if (left > 1) range.push("...");
    for (let i = left; i <= right; i++) range.push(i);
    if (right < totalPages - 2) range.push("...");
    if (right < totalPages - 1) range.push(totalPages - 1);
    return range;
  };

  const from = totalElements === 0 ? 0 : page * pageSize + 1;
  const to = Math.min((page + 1) * pageSize, totalElements);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-4 border-t border-amber-100">
      <p className="text-sm text-gray-600">
        Hiển thị <b>{from}–{to}</b> trên <b>{totalElements}</b> đơn hàng
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => go(page - 1)}
          disabled={page === 0}
          className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
        >
          ← Trước
        </button>

        {buildPages().map((p, idx) =>
          p === "..." ? (
            <span key={`dots-${idx}`} className="px-2 text-gray-400">…</span>
          ) : (
            <button
              key={p}
              onClick={() => go(p)}
              className={`min-w-[36px] px-3 py-1.5 rounded-lg text-sm font-medium border transition ${
                p === page
                  ? "bg-[#8B5E3C] text-white border-[#8B5E3C]"
                  : "border-gray-300 hover:bg-gray-100"
              }`}
            >
              {p + 1}
            </button>
          )
        )}

        <button
          onClick={() => go(page + 1)}
          disabled={page >= totalPages - 1}
          className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
        >
          Sau →
        </button>
      </div>
    </div>
  );
}