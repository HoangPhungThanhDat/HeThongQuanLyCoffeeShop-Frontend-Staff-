
import { useQuery } from "@tanstack/react-query";
import OrderAPI from "@/api/orderApi";
import { orderKeys } from "./useOrders";

/**
 * Stats toàn bộ orders (không phân trang).
 * Map field từ BE → tên dùng trong OrderStats.jsx
 *
 * BE trả: { total, pending, paid, cancelled, totalRevenue, confirmed }
 */
export function useOrderStats() {
  return useQuery({
    queryKey: orderKeys.stats(),
    queryFn: async () => {
      const res = await OrderAPI.getStats();
      const d = res.data;
      return {
        total: Number(d.total ?? 0),
        pending: Number(d.pending ?? 0),
        confirmed: Number(d.confirmed ?? 0),
        preparing: Number(d.preparing ?? 0),
        served: Number(d.served ?? 0),
        paid: Number(d.paid ?? 0),
        cancelled: Number(d.cancelled ?? 0),
        activeOrders:
          Number(d.pending ?? 0) +
          Number(d.confirmed ?? 0) +
          Number(d.preparing ?? 0) +
          Number(d.served ?? 0),
        todayRevenue: Number(d.todayRevenue ?? d.totalRevenue ?? 0),
      };
    },
    staleTime: 60 * 1000,
  });
}

export default useOrderStats;