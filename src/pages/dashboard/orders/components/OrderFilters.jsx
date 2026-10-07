
import {
    ArrowPathIcon,
    ViewColumnsIcon,
    ListBulletIcon,
  } from "@heroicons/react/24/outline";
  import { ORDER_FILTER_OPTIONS } from "../constants/orderStatus";
  
  export function OrderFilters({
    viewMode,
    onViewModeChange,
    selectedStatus,
    onStatusChange,
    onClear,
    hasActiveFilters,
  }) {
    return (
      <>
        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-xl p-1 border border-white/30">
          <button
            onClick={() => onViewModeChange("kanban")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all text-xs font-extrabold uppercase ${
              viewMode === "kanban"
                ? "bg-white text-[#8B5E3C] shadow-md"
                : "text-white/80 hover:bg-white/10"
            }`}
          >
            <ViewColumnsIcon className="w-4 h-4" strokeWidth={2.5} />
            Kanban
          </button>
          <button
            onClick={() => onViewModeChange("table")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all text-xs font-extrabold uppercase ${
              viewMode === "table"
                ? "bg-white text-[#8B5E3C] shadow-md"
                : "text-white/80 hover:bg-white/10"
            }`}
          >
            <ListBulletIcon className="w-4 h-4" strokeWidth={2.5} />
            Table
          </button>
        </div>
  
        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-3 py-2.5 rounded-xl bg-white/95 border border-white/50 text-xs font-medium text-gray-700 focus:outline-none shadow-sm cursor-pointer"
        >
          {ORDER_FILTER_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
  
        {/* Clear Filter */}
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 border border-white/30 text-white text-xs font-bold transition-all duration-200"
          >
            <ArrowPathIcon className="w-3.5 h-3.5" />
            Xóa lọc
          </button>
        )}
      </>
    );
  }
  
  export default OrderFilters;