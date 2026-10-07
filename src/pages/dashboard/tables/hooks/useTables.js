
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import TableAPI from "@/api/tableApi";
import { TABLE_MESSAGES } from "../constants/messages";
import { matchesSearch } from "../utils/formatters";
import { toast } from "@/lib/toast";

export const tableKeys = {
  all: ["tables"],
  lists: () => [...tableKeys.all, "list"],
  list: (filters) => [...tableKeys.lists(), filters],
  details: () => [...tableKeys.all, "detail"],
  detail: (id) => [...tableKeys.details(), id],
};

export function useTables() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const query = useQuery({
    queryKey: tableKeys.lists(),
    queryFn: async () => {
      const response = await TableAPI.getAll();
      const data = Array.isArray(response.data) ? response.data : [];
      return [...data].sort((a, b) => b.id - a.id);
    },
    onError: () => {
      toast.error(TABLE_MESSAGES.FETCH_ERROR);
    },
  });

  const tables = query.data || [];

  // ============ FILTER ============
  const filteredTables = useMemo(() => {
    let result = [...tables];

    if (statusFilter !== "ALL") {
      result = result.filter((t) => t.status === statusFilter);
    }

    if (searchTerm.trim()) {
      result = result.filter((t) =>
        matchesSearch(searchTerm, t.number, t.id)
      );
    }

    return result;
  }, [tables, searchTerm, statusFilter]);

  // ============ STATS ============
  const stats = useMemo(() => {
    const total = tables.length;
    const freeTables = tables.filter((t) => t.status === "FREE").length;
    const occupiedTables = tables.filter((t) => t.status === "OCCUPIED").length;
    const reservedTables = tables.filter((t) => t.status === "RESERVED").length;

    return { total, freeTables, occupiedTables, reservedTables };
  }, [tables]);

  // ============ HELPERS ============
  const toggleStatusFilter = (status) => {
    setStatusFilter((prev) => (prev === status ? "ALL" : status));
  };

  const clearFilters = () => {
    setStatusFilter("ALL");
    setSearchTerm("");
  };

  const hasActiveFilters =
    statusFilter !== "ALL" || searchTerm.trim() !== "";

  return {
    // Data
    tables,
    filteredTables,
    stats,

    // Filter state
    searchTerm,
    statusFilter,
    hasActiveFilters,

    // Filter actions
    setSearchTerm,
    setStatusFilter,
    toggleStatusFilter,
    clearFilters,

    // Query state
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,

    // Actions
    refetch: query.refetch,
  };
}

export default useTables;