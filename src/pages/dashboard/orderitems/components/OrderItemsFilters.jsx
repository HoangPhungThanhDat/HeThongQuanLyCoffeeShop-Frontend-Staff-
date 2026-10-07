
import { MagnifyingGlassIcon, ArrowPathIcon, XCircleIcon } from "@heroicons/react/24/outline";

export function OrderItemsFilters({
  orders = [],
  orderFilter,
  onOrderFilterChange,
  searchTerm,
  onSearchChange,
  onClear,
  hasActiveFilters,
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
      {/* Order Filter */}
      <select
        value={orderFilter}
        onChange={(e) => onOrderFilterChange(e.target.value)}
        className="px-3 py-2.5 rounded-xl bg-white/95 border border-white/50 text-xs font-medium text-gray-700 focus:outline-none shadow-sm cursor-pointer max-w-[200px]"
      >
        <option value="ALL">📋 Tất cả đơn hàng</option>
        {orders.slice(0, 50).map((o) => (
          <option key={o.id} value={o.id.toString()}>
            #{o.id} · Bàn {o.table?.number || "N/A"}
          </option>
        ))}
      </select>

      {/* Search */}
      <div className="relative w-full lg:w-auto">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B5E3C]" />
        <input
          type="text"
          placeholder="Tìm mã item, đơn, sản phẩm..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full lg:w-72 pl-10 pr-10 py-2.5 rounded-xl bg-white/95 border border-white/50 text-xs font-medium text-gray-700 placeholder-gray-400 focus:outline-none shadow-sm"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Xóa tìm kiếm"
          >
            <XCircleIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Clear */}
      {hasActiveFilters && (
        <button
          onClick={onClear}
          className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 border border-white/30 text-white text-xs font-bold transition-all duration-200"
        >
          <ArrowPathIcon className="w-3.5 h-3.5" />
          Xóa lọc
        </button>
      )}
    </div>
  );
}

export default OrderItemsFilters;