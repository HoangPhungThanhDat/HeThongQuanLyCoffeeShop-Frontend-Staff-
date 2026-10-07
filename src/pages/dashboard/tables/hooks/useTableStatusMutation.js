
import { useMutation, useQueryClient } from "@tanstack/react-query";
import TableAPI from "@/api/tableApi";
import { TABLE_MESSAGES, STATUS_TEXT_MAP } from "../constants/messages";
import { tableKeys } from "./useTables";
import { toast } from "@/lib/toast";

/**
 * Mutation update status với OPTIMISTIC UPDATE
 * - Update UI ngay lập tức
 * - Rollback nếu API lỗi
 */
export function useTableStatusMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ tableId, currentTable, newStatus }) =>
      TableAPI.update(tableId, {
        ...currentTable,
        status: newStatus,
      }),

    // ⭐ Optimistic update
    onMutate: async ({ tableId, newStatus }) => {
      // Cancel các query đang chạy để không ghi đè
      await queryClient.cancelQueries({ queryKey: tableKeys.lists() });

      // Lưu snapshot để rollback nếu cần
      const previousData = queryClient.getQueryData(tableKeys.lists());

      // Update cache ngay
      queryClient.setQueryData(tableKeys.lists(), (old) => {
        if (!Array.isArray(old)) return old;
        return old.map((t) =>
          t.id === tableId ? { ...t, status: newStatus } : t
        );
      });

      return { previousData };
    },

    // ⭐ Rollback khi lỗi
    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(tableKeys.lists(), context.previousData);
      }
      toast.error(TABLE_MESSAGES.UPDATE_ERROR);
    },

    // ⭐ Refetch sau khi thành công để đồng bộ với server
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: tableKeys.lists() });
    },
  });

  /**
   * Wrapper: xử lý logic check trùng status + toast
   */
  const updateStatus = async (tableId, currentTable, newStatus) => {
    if (currentTable.status === newStatus) {
      toast.info(TABLE_MESSAGES.NO_CHANGE);
      return false;
    }

    try {
      await mutation.mutateAsync({ tableId, currentTable, newStatus });
      const statusText = STATUS_TEXT_MAP[newStatus] || newStatus;
      toast.success(`✅ Đã đổi sang: ${statusText}`);
      return true;
    } catch {
      // onError đã show toast
      return false;
    }
  };

  return {
    updateStatus,
    isUpdating: mutation.isPending,
  };
}

export default useTableStatusMutation;