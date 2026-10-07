
import { useQuery } from "@tanstack/react-query";
import BillApi from "@/api/billApi";
import { billKeys } from "./useBills";

/**
 * Stats toàn bộ bills (không phân trang).
 * BE trả: { total, paidCount, pendingCount, cancelledCount, totalRevenue }
 *
 * ⚠️ Giữ tên field khớp với BillStats.jsx + BillHeader.jsx cũ:
 * totalBills, completedBills, pendingBills, failedBills, totalRevenue
 *
 * Mapping:
 * - BE "paidCount"      → FE "completedBills"
 * - BE "cancelledCount" → FE "failedBills"
 */
export function useBillStats() {
  return useQuery({
    queryKey: billKeys.stats(),
    queryFn: async () => {
      const res = await BillApi.getStats();
      const d = res.data;
      return {
        totalBills: Number(d.total ?? 0),
        completedBills: Number(d.paidCount ?? d.completedCount ?? 0),
        pendingBills: Number(d.pendingCount ?? 0),
        failedBills: Number(d.cancelledCount ?? d.failedCount ?? 0),
        totalRevenue: Number(d.totalRevenue ?? 0),
      };
    },
    staleTime: 60 * 1000,
  });
}

export default useBillStats;