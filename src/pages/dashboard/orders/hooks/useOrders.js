// src/pages/dashboard/orders/hooks/useOrders.js
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useState, useEffect, useMemo, useCallback } from "react";
import OrderAPI from "@/api/orderApi";
import { ORDER_MESSAGES } from "../constants/messages";
import { toast } from "@/lib/toast";

export const orderKeys = {
  all: ["orders"],
  lists: () => [...orderKeys.all, "list"],
  list: (filters) => [...orderKeys.lists(), filters],
  details: () => [...orderKeys.all, "detail"],
  detail: (id) => [...orderKeys.details(), id],
  stats: () => [...orderKeys.all, "stats"],
  // ⭐ Key riêng cho Kanban (không phân trang)
  kanban: () => [...orderKeys.all, "kanban"],
};

const DEFAULT_PAGE_SIZE = 10;

/**
 * Hook useOrders — hỗ trợ 2 chế độ:
 * - Table: phân trang server-side (10 đơn/trang)
 * - Kanban: lấy tất cả đơn (size=1000)
 *
 * @param {{ mode?: "table" | "kanban" }} options
 */
export function useOrders(options = {}) {
  const { mode = "table" } = options;

  const [searchTerm, setSearchTermRaw] = useState("");
  const [selectedStatus, setSelectedStatusRaw] = useState("ALL");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortBy, setSortBy] = useState("id");
  const [sortDir, setSortDir] = useState("desc");

  // Debounce search
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebouncedKeyword(searchTerm.trim()), 400);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Params cho Table
  const tableParams = useMemo(
    () => ({
      page,
      size,
      keyword: debouncedKeyword || undefined,
      status: selectedStatus !== "ALL" ? selectedStatus : undefined,
      sortBy,
      sortDir,
    }),
    [page, size, debouncedKeyword, selectedStatus, sortBy, sortDir]
  );

  // ⭐ Table query — phân trang
  const tableQuery = useQuery({
    queryKey: orderKeys.list(tableParams),
    queryFn: async () => {
      const res = await OrderAPI.getAll(tableParams);
      return res.data;
    },
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
    enabled: mode === "table",   // ⭐ chỉ chạy khi ở Table mode
  });

  // ⭐ Kanban query — lấy tất cả
  const kanbanQuery = useQuery({
    queryKey: orderKeys.kanban(),
    queryFn: async () => {
      const res = await OrderAPI.getAll({ page: 0, size: 1000, sortBy, sortDir });
      const rawData = res.data;
      const content = Array.isArray(rawData?.content)
        ? rawData.content
        : Array.isArray(rawData)
        ? rawData
        : [];
      return content;
    },
    staleTime: 30 * 1000,
    enabled: mode === "kanban",  // ⭐ chỉ chạy khi ở Kanban mode
  });

  // Chọn data tùy mode
  const pageData = mode === "table" ? tableQuery.data : null;
  const orders =
    mode === "table"
      ? pageData?.content ?? []
      : kanbanQuery.data ?? [];

  const query = mode === "table" ? tableQuery : kanbanQuery;

  // Error handling
  useEffect(() => {
    if (query.isError) {
      toast.error(ORDER_MESSAGES?.FETCH_ERROR || "Không tải được đơn hàng");
    }
  }, [query.isError]);

  // Tự lùi trang khi trang cuối bị xoá hết (chỉ Table mode)
  useEffect(() => {
    if (
      mode === "table" &&
      !tableQuery.isLoading &&
      !tableQuery.isFetching &&
      pageData &&
      pageData.content?.length === 0 &&
      page > 0
    ) {
      setPage((p) => p - 1);
    }
  }, [mode, pageData, page, tableQuery.isLoading, tableQuery.isFetching]);

  // ⭐ Filter cho Kanban (vì Kanban fetch hết, cần filter client-side)
  const filteredOrders = useMemo(() => {
    if (mode === "table") return orders; // Table: BE đã filter
    // Kanban: filter client-side
    let result = [...orders];

    if (selectedStatus !== "ALL") {
      result = result.filter((o) => o.status === selectedStatus);
    }

    if (debouncedKeyword) {
      const term = debouncedKeyword.toLowerCase();
      result = result.filter(
        (o) =>
          o.id?.toString().includes(term) ||
          o.table?.number?.toLowerCase().includes(term) ||
          o.notes?.toLowerCase().includes(term)
      );
    }

    return result;
  }, [mode, orders, selectedStatus, debouncedKeyword]);

  // Handlers reset page
  const setSearchTerm = useCallback((v) => { setSearchTermRaw(v); setPage(0); }, []);
  const setSelectedStatus = useCallback((v) => { setSelectedStatusRaw(v); setPage(0); }, []);
  const toggleStatusFilter = useCallback((status) => {
    setSelectedStatusRaw((prev) => (prev === status ? "ALL" : status));
    setPage(0);
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedStatusRaw("ALL");
    setSearchTermRaw("");
    setPage(0);
  }, []);

  const hasActiveFilters =
    selectedStatus !== "ALL" || searchTerm.trim() !== "";

  return {
    // Data — Table: 10 đơn trang hiện tại | Kanban: tất cả đơn
    orders,

    // Filtered (Table: = orders | Kanban: filter client-side)
    filteredOrders,

    // Pagination (chỉ dùng cho Table mode)
    page: pageData?.page ?? 0,
    size: pageData?.size ?? size,
    totalPages: pageData?.totalPages ?? 0,
    totalElements: mode === "table"
      ? pageData?.totalElements ?? 0
      : orders.length,   // Kanban: tổng = số lượng hiện có
    hasNext: pageData?.hasNext ?? false,
    hasPrevious: pageData?.hasPrevious ?? false,
    setPage,
    setSize,
    sortBy,
    sortDir,
    setSortBy,
    setSortDir,

    // Filter
    searchTerm,
    selectedStatus,
    hasActiveFilters,
    setSearchTerm,
    setSelectedStatus,
    toggleStatusFilter,
    clearFilters,

    // Query state
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export default useOrders;