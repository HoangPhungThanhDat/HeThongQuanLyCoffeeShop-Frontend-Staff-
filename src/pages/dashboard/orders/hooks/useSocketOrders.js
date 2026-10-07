// src/pages/dashboard/orders/hooks/useSocketOrders.js
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocketNotifications } from "@/context/SocketContext";
import { orderKeys } from "./useOrders";

export function useSocketOrders({ onShowOrder } = {}) {
  const queryClient = useQueryClient();
  const {
    newOrderNotification,
    setNewOrderNotification,
    currentOrder,
    setCurrentOrder,
    refreshTrigger,
  } = useSocketNotifications();

  // ⭐ refreshTrigger thay đổi → invalidate TẤT CẢ query orders
  useEffect(() => {
    if (refreshTrigger > 0) {
      console.log("🔄 [Orders] refreshTrigger thay đổi:", refreshTrigger);
      // Invalidate all → list + kanban + stats tự refetch
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    }
  }, [refreshTrigger, queryClient]);

  // currentOrder được set → mở Show dialog
  useEffect(() => {
    if (currentOrder && onShowOrder) {
      onShowOrder(currentOrder);
      setCurrentOrder(null);
    }
  }, [currentOrder, setCurrentOrder, onShowOrder]);

  return {
    newOrderNotification,
    dismissNotification: () => setNewOrderNotification(null),
  };
}

export default useSocketOrders;