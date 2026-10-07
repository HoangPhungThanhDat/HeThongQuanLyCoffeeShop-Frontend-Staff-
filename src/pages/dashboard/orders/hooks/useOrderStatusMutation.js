import { useMutation, useQueryClient } from "@tanstack/react-query";
import OrderAPI from "@/api/orderApi";
import TableAPI from "@/api/tableApi";
import socket from "@/socket";
import {
  ORDER_MESSAGES,
  STATUS_LABEL_MAP,
} from "../constants/messages";
import { toStatusUpdatePayload } from "../schemas/orderSchema";
import { orderKeys } from "./useOrders";
import { toast } from "@/lib/toast";

/**
 * ⭐ Helper: lấy order từ BẤT KỲ cache query nào (kanban / list / detail)
 * Duyệt tất cả query đang có để tìm order theo id
 */
const findOrderInCache = (queryClient, orderId) => {
  // 1. Thử tìm trong Kanban cache
  const kanbanData = queryClient.getQueryData(orderKeys.kanban());
  if (Array.isArray(kanbanData)) {
    const found = kanbanData.find((o) => o.id === orderId);
    if (found) return found;
  }

  // 2. Thử tìm trong tất cả list caches (Table mode — có params)
  const allQueries = queryClient.getQueryCache().findAll({
    queryKey: orderKeys.all,   // ["orders", ...]
  });

  for (const query of allQueries) {
    const data = query.state.data;
    // data có thể là PageResponse {content: [...]} hoặc array
    const items = Array.isArray(data?.content)
      ? data.content
      : Array.isArray(data)
      ? data
      : [];
    const found = items.find((o) => o.id === orderId);
    if (found) return found;
  }

  // 3. Thử tìm trong detail cache
  const detailData = queryClient.getQueryData(orderKeys.detail(orderId));
  if (detailData && detailData.id === orderId) return detailData;

  return null;
};

/**
 * ⭐ Helper: update order trong cache (optimistic)
 * Set cho TẤT CẢ query có chứa order này
 */
const updateOrderInCache = (queryClient, orderId, updater) => {
  // 1. Kanban cache
  queryClient.setQueryData(orderKeys.kanban(), (old) => {
    if (!Array.isArray(old)) return old;
    return old.map((o) => (o.id === orderId ? updater(o) : o));
  });

  // 2. Tất cả list caches (Table mode)
  const allQueries = queryClient.getQueryCache().findAll({
    queryKey: orderKeys.all,
  });

  for (const query of allQueries) {
    queryClient.setQueryData(query.queryKey, (old) => {
      if (!old) return old;

      // PageResponse
      if (Array.isArray(old.content)) {
        return {
          ...old,
          content: old.content.map((o) => (o.id === orderId ? updater(o) : o)),
        };
      }

      // Array
      if (Array.isArray(old)) {
        return old.map((o) => (o.id === orderId ? updater(o) : o));
      }

      // Detail object
      if (old.id === orderId) {
        return updater(old);
      }

      return old;
    });
  }
};

/**
 * Hook update status đơn hàng + sync table + emit socket
 * Bao gồm optimistic update
 */
export function useOrderStatusMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ orderId, newStatus, currentOrder }) => {
      // 1. Update order status
      const payload = toStatusUpdatePayload(currentOrder, newStatus);
      await OrderAPI.update(orderId, payload);

      // 2. Emit socket: staff update status
      socket.emit("staff-update-status", {
        orderId: orderId.toString(),
        newStatus,
        timestamp: new Date().toISOString(),
        staffId: socket.id,
      });

      // 3. Sync table status
      const table = currentOrder.table;
      if (table?.id) {
        let tableStatus = null;

        if (newStatus === "SERVED") tableStatus = "OCCUPIED";
        else if (newStatus === "PAID" || newStatus === "CANCELLED")
          tableStatus = "FREE";

        if (tableStatus) {
          try {
            await TableAPI.update(table.id, {
              tableNumber: table.number,
              capacity: table.capacity,
              status: tableStatus,
            });

            socket.emit("table-status-changed", {
              tableId: table.id,
              tableNumber: table.number,
              newStatus: tableStatus,
              orderId: orderId.toString(),
              timestamp: new Date().toISOString(),
              updatedBy: socket.id,
            });
          } catch (tableError) {
            console.error(ORDER_MESSAGES.UPDATE_TABLE_ERROR, tableError);
          }
        }
      }

      return { orderId, newStatus };
    },

    // ⭐ Optimistic update — update TẤT CẢ cache
    onMutate: async ({ orderId, newStatus }) => {
      // Cancel mọi query đang chạy để tránh ghi đè
      await queryClient.cancelQueries({ queryKey: orderKeys.all });

      // Snapshot để rollback nếu lỗi
      const previousKanban = queryClient.getQueryData(orderKeys.kanban());
      const allQueries = queryClient.getQueryCache().findAll({
        queryKey: orderKeys.all,
      });
      const previousSnapshots = allQueries.map((q) => ({
        key: q.queryKey,
        data: q.state.data,
      }));

      // Update optimistic
      updateOrderInCache(queryClient, orderId, (o) => ({
        ...o,
        status: newStatus,
      }));

      return { previousKanban, previousSnapshots };
    },

    onError: (err, variables, context) => {
      // Rollback
      if (context?.previousKanban !== undefined) {
        queryClient.setQueryData(orderKeys.kanban(), context.previousKanban);
      }
      if (context?.previousSnapshots) {
        context.previousSnapshots.forEach((snap) => {
          queryClient.setQueryData(snap.key, snap.data);
        });
      }

      toast.error(
        err.response?.data?.message || ORDER_MESSAGES.UPDATE_STATUS_ERROR
      );
    },

    onSuccess: (_, { newStatus }) => {
      const label = STATUS_LABEL_MAP[newStatus] || newStatus;
      toast.success(ORDER_MESSAGES.UPDATE_STATUS_SUCCESS(label));
    },

    onSettled: () => {
      // Invalidate TẤT CẢ để refetch từ BE
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });

  /**
   * Wrapper — nhận (orderId, newStatus) + lookup currentOrder từ BẤT KỲ cache
   */
  const updateStatus = async (orderId, newStatus) => {
    // ⭐ SỬA: dùng helper tìm trong tất cả cache
    const currentOrder = findOrderInCache(queryClient, orderId);

    if (!currentOrder) {
      console.warn("⚠️ Không tìm thấy order trong cache:", orderId);
      toast.error(ORDER_MESSAGES.ORDER_NOT_FOUND);
      return false;
    }

    if (currentOrder.status === newStatus) {
      toast.info("ℹ️ Trạng thái không thay đổi");
      return false;
    }

    try {
      await mutation.mutateAsync({ orderId, newStatus, currentOrder });
      return true;
    } catch {
      return false;
    }
  };

  return {
    updateStatus,
    isUpdating: mutation.isPending,
  };
}

export default useOrderStatusMutation;