
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useState, useEffect, useMemo, useCallback } from "react";
import BillApi from "@/api/billApi";
import { BILL_MESSAGES } from "../constants/messages";
import { toast } from "@/lib/toast";

export const billKeys = {
  all: ["bills"],
  lists: () => [...billKeys.all, "list"],
  list: (filters) => [...billKeys.lists(), filters],
  details: () => [...billKeys.all, "detail"],
  detail: (id) => [...billKeys.details(), id],
  stats: () => [...billKeys.all, "stats"],   // ⭐ THÊM
};

const DEFAULT_PAGE_SIZE = 10;

export function useBills() {
  const [searchTerm, setSearchTermRaw] = useState("");
  const [statusFilter, setStatusFilterRaw] = useState("ALL");
  const [methodFilter, setMethodFilterRaw] = useState("ALL");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortBy, setSortBy] = useState("id");
  const [sortDir, setSortDir] = useState("desc");

  // Debounce search 400ms
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebouncedKeyword(searchTerm.trim()), 400);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const params = useMemo(
    () => ({
      page,
      size,
      keyword: debouncedKeyword || undefined,
      paymentStatus: statusFilter !== "ALL" ? statusFilter : undefined,
      paymentMethod: methodFilter !== "ALL" ? methodFilter : undefined,
      sortBy,
      sortDir,
    }),
    [page, size, debouncedKeyword, statusFilter, methodFilter, sortBy, sortDir]
  );

  const query = useQuery({
    queryKey: billKeys.list(params),
    queryFn: async () => {
      const response = await BillApi.getAll(params);
      return response.data;
    },
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });

  const pageData = query.data;
  const bills = pageData?.content ?? [];

  useEffect(() => {
    if (query.isError) {
      toast.error(BILL_MESSAGES?.FETCH_ERROR || "Không tải được hoá đơn");
    }
  }, [query.isError]);

  // Tự lùi trang khi trang cuối bị xoá hết
  useEffect(() => {
    if (
      !query.isLoading &&
      !query.isFetching &&
      pageData &&
      pageData.content?.length === 0 &&
      page > 0
    ) {
      setPage((p) => p - 1);
    }
  }, [pageData, page, query.isLoading, query.isFetching]);

  // Handlers reset page
  const setSearchTerm = useCallback((v) => { setSearchTermRaw(v); setPage(0); }, []);
  const setStatusFilter = useCallback((v) => { setStatusFilterRaw(v); setPage(0); }, []);
  const setMethodFilter = useCallback((v) => { setMethodFilterRaw(v); setPage(0); }, []);

  const toggleStatusFilter = useCallback((status) => {
    setStatusFilterRaw((prev) => (prev === status ? "ALL" : status));
    setPage(0);
  }, []);

  const clearFilters = useCallback(() => {
    setStatusFilterRaw("ALL");
    setMethodFilterRaw("ALL");
    setSearchTermRaw("");
    setPage(0);
  }, []);

  const hasActiveFilters =
    statusFilter !== "ALL" ||
    methodFilter !== "ALL" ||
    searchTerm.trim() !== "";

  return {
    // Data
    bills,

    // Pagination
    page: pageData?.page ?? 0,
    size: pageData?.size ?? size,
    totalPages: pageData?.totalPages ?? 0,
    totalElements: pageData?.totalElements ?? 0,
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
    statusFilter,
    methodFilter,
    hasActiveFilters,
    setSearchTerm,
    setStatusFilter,
    setMethodFilter,
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

export default useBills;