// src/pages/dashboard/orderitems/hooks/useOrderItemMutations.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import OrderItemAPI from "@/api/orderitemApi";
import {
  ORDER_ITEM_MESSAGES,
  ORDER_ITEM_DELETE_CONFIRM,
} from "../constants/messages";
import { toast } from "@/lib/toast";
import { orderItemKeys } from "./useOrderItems";

// ==================== HOOK ====================
export function useOrderItemMutations() {
  const queryClient = useQueryClient();

  // ⭐ Helper: invalidate cả list + detail + stats
  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: orderItemKeys.all });
  };

  // ============ CREATE ============
  const createMutation = useMutation({
    mutationFn: (data) => OrderItemAPI.create(data),
    onSuccess: () => {
      invalidateAll();
      toast.success(ORDER_ITEM_MESSAGES.CREATE_SUCCESS);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || ORDER_ITEM_MESSAGES.CREATE_ERROR
      );
    },
  });

  // ============ UPDATE ============
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => OrderItemAPI.update(id, data),
    onSuccess: (_, variables) => {
      invalidateAll();
      // Invalidate thêm detail riêng nếu cần
      queryClient.invalidateQueries({
        queryKey: orderItemKeys.detail(variables.id),
      });
      toast.success(ORDER_ITEM_MESSAGES.UPDATE_SUCCESS);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || ORDER_ITEM_MESSAGES.UPDATE_ERROR
      );
    },
  });

  // ============ DELETE ============
  const deleteMutation = useMutation({
    mutationFn: (id) => OrderItemAPI.delete(id),
    onSuccess: () => {
      invalidateAll();
      toast.success(ORDER_ITEM_MESSAGES.DELETE_SUCCESS);
    },
    onError: () => {
      toast.error(ORDER_ITEM_MESSAGES.DELETE_ERROR);
    },
  });

  // ============ CHANGE PRODUCT (delete old + create new) ============
  const changeProductMutation = useMutation({
    mutationFn: async ({ oldId, newData }) => {
      await OrderItemAPI.delete(oldId);
      return OrderItemAPI.create(newData);
    },
    onSuccess: () => {
      invalidateAll();
      toast.success(ORDER_ITEM_MESSAGES.CHANGE_PRODUCT_SUCCESS);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || ORDER_ITEM_MESSAGES.UPDATE_ERROR
      );
    },
  });

  // ============ DELETE WITH CONFIRM ============
  const confirmAndDelete = async (id) => {
    const confirm = await toast.confirm(ORDER_ITEM_DELETE_CONFIRM);
    if (confirm.isConfirmed) {
      return deleteMutation.mutateAsync(id);
    }
    return false;
  };

  return {
    // Create
    create: createMutation.mutateAsync,
    isCreating: createMutation.isPending,

    // Update
    update: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,

    // Delete
    delete: deleteMutation.mutateAsync,
    confirmAndDelete,
    isDeleting: deleteMutation.isPending,

    // Change product
    changeProduct: changeProductMutation.mutateAsync,
    isChangingProduct: changeProductMutation.isPending,

    // Combined loading state
    isSubmitting:
      createMutation.isPending ||
      updateMutation.isPending ||
      changeProductMutation.isPending ||
      deleteMutation.isPending,
  };
}

// ==================== DEFAULT EXPORT ====================
export default useOrderItemMutations;