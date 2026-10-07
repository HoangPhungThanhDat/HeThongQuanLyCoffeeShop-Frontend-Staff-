
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import socket from "@/socket";
import { orderItemKeys } from "./useOrderItems";
import { ORDER_ITEM_MESSAGES } from "../constants/messages";
import { toast } from "@/lib/toast";

export function useSocketOrderItems(options = {}) {
  const { enabled = true } = options;
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled) return;

    console.log("🔌 Kết nối Socket trong OrderItems...");

    const handleConnect = () => {
      console.log("✅ Socket connected trong OrderItems:", socket.id);
    };

    const handleItemsAdded = (data) => {
      console.log("\n📦 Nhận thông báo có món mới được thêm:", data);

      // ⭐ SỬA: invalidate ALL (bao gồm list + detail + stats)
      queryClient.invalidateQueries({ queryKey: orderItemKeys.all });

      const itemsText =
        data.addedItems?.length === 1
          ? "1 món mới"
          : `${data.addedItems?.length || 0} món mới`;

      toast.info(
        ORDER_ITEM_MESSAGES.SOCKET_ITEMS_ADDED(
          data.orderId,
          itemsText,
          data.newTotal || 0
        )
      );
    };

    const handleStaffNotification = (data) => {
      if (data.type === "items-added") {
        console.log(
          "🔔 Staff notification: items added to order #" + data.orderId
        );
        // ⭐ SỬA: invalidate ALL
        queryClient.invalidateQueries({ queryKey: orderItemKeys.all });
      }
    };

    socket.on("connect", handleConnect);
    socket.on("items-added-to-order", handleItemsAdded);
    socket.on("staff-notification", handleStaffNotification);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("items-added-to-order", handleItemsAdded);
      socket.off("staff-notification", handleStaffNotification);
      console.log("🔌 Đã ngắt Socket listener trong OrderItems");
    };
  }, [enabled, queryClient]);
}

export default useSocketOrderItems;