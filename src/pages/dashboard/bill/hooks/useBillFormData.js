// src/pages/dashboard/bill/hooks/useBillFormData.js
import { useQuery } from "@tanstack/react-query";
import OrderAPI from "@/api/orderApi";
import { BILL_MESSAGES } from "../constants/messages";
import { toast } from "@/lib/toast";

export const billFormDataKeys = {
  all: ["bill-form-data"],
  orders: () => [...billFormDataKeys.all, "orders"],
};

/**
 * ⭐ Helper: Đảm bảo luôn trả về array
 * Xử lý cả: array, PageResponse ({ content: [...] }), null, wrapper
 */
const ensureArray = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content; // Spring PageResponse
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

export function useBillFormData(options = {}) {
  const { enabled = true } = options;

  const ordersQuery = useQuery({
    queryKey: billFormDataKeys.orders(),
    queryFn: async () => {
      // ⭐ Orders API đã phân trang → lấy tất cả với size lớn
      const res = await OrderAPI.getAll({ page: 0, size: 1000 });
      return ensureArray(res.data);
    },
    enabled,
    staleTime: 5 * 60 * 1000,
    onError: () => {
      toast.error(BILL_MESSAGES.FETCH_ORDERS_ERROR);
    },
  });

  return {
    orders: ordersQuery.data || [],
    isLoading: ordersQuery.isLoading,
  };
}

export default useBillFormData;