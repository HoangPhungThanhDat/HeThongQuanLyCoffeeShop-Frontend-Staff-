
import { useQuery } from "@tanstack/react-query";
import OrderItemAPI from "@/api/orderitemApi";
import { orderItemKeys } from "./useOrderItems";

/**
 * Stats toàn bộ order items (không phân trang).
 * BE trả: { total, totalQuantity, totalRevenue, avgPrice }
 *
 * ⚠️ Giữ tên field khớp với `OrderItemsStats.jsx` cũ:
 * totalItems, totalQuantity, totalRevenue, uniqueOrders
 */
export function useOrderItemStats() {
  return useQuery({
    queryKey: orderItemKeys.stats(),
    queryFn: async () => {
      const res = await OrderItemAPI.getStats();
      const d = res.data;
      return {
        totalItems: Number(d.total ?? 0),
        totalQuantity: Number(d.totalQuantity ?? 0),
        totalRevenue: Number(d.totalRevenue ?? 0),
        uniqueOrders: Number(d.uniqueOrders ?? 0), // nếu BE có
        avgPrice: Number(d.avgPrice ?? 0),
      };
    },
    staleTime: 60 * 1000,
  });
}

export default useOrderItemStats;