
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import socket from "@/socket";
import { tableKeys } from "./useTables";
import {
  TABLE_MESSAGES,
  STATUS_TEXT_SHORT,
  STATUS_ICON_MAP,
} from "../constants/messages";
import { toast } from "@/lib/toast";

/**
 * Hook xử lý Socket.IO cho module Tables
 * - Khi nhận sự kiện "table-status-changed" → invalidate cache để refetch
 * - Hiển thị toast thông báo cho user
 */
export function useSocketTables(options = {}) {
  const { enabled = true } = options;
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled) return;

    console.log("🔌 Đang kết nối Socket.IO cho Tables...");

    const handleConnect = () => {
      console.log("✅ Socket connected trong Tables:", socket.id);
    };

    const handleStatusChanged = (data) => {
      console.log("\n🪑 ==========================================");
      console.log("🪑 NHẬN CẬP NHẬT TRẠNG THÁI BÀN");
      console.log("🪑 ==========================================");
      console.log(`   - Table ID: ${data.tableId}`);
      console.log(`   - Table Number: ${data.tableNumber}`);
      console.log(`   - New Status: ${data.newStatus}`);
      console.log(`   - Order ID: ${data.orderId}`);
      console.log("==========================================\n");

      // ⭐ Invalidate để React Query tự refetch
      queryClient.invalidateQueries({ queryKey: tableKeys.lists() });

      // Toast thông báo
      const statusText = STATUS_TEXT_SHORT[data.newStatus] || data.newStatus;
      const statusIcon = STATUS_ICON_MAP[data.newStatus] || "🪑";
      toast.info(
        TABLE_MESSAGES.SOCKET_STATUS_CHANGED(
          data.tableNumber,
          statusText,
          statusIcon
        )
      );
    };

    socket.on("connect", handleConnect);
    socket.on("table-status-changed", handleStatusChanged);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("table-status-changed", handleStatusChanged);
      console.log("🔌 Đã ngắt kết nối Socket listeners trong Tables");
    };
  }, [enabled, queryClient]);
}

export default useSocketTables;