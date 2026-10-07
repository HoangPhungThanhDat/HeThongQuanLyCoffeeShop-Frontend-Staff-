
import { MagnifyingGlassIcon, XCircleIcon } from "@heroicons/react/24/outline";

export function TablesSearch({
  value,
  onChange,
  placeholder = "Tìm bàn...",
}) {
  return (
    <div className="relative w-full lg:w-auto">
      <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 2xl:w-5 2xl:h-5 text-[#8B5E3C]" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full lg:w-56 xl:w-64 2xl:w-72 pl-11 pr-10 py-2.5 2xl:py-3 rounded-xl bg-white/95 border border-white/50 text-sm 2xl:text-base font-medium text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-sm"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Xóa tìm kiếm"
        >
          <XCircleIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export default TablesSearch;