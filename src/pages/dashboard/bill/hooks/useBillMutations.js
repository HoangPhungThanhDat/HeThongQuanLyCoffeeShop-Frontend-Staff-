
import { useMutation, useQueryClient } from "@tanstack/react-query";
import BillApi from "@/api/billApi";
import {
  BILL_MESSAGES,
  BILL_DELETE_CONFIRM,
} from "../constants/messages";
import { toast } from "@/lib/toast";
import { billKeys } from "./useBills";

export function useBillMutations() {
  const queryClient = useQueryClient();

  // ⭐ Helper: invalidate cả list + detail + stats
  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: billKeys.all });
  };

  const createMutation = useMutation({
    mutationFn: (data) => BillApi.create(data),
    onSuccess: () => {
      invalidateAll();
      toast.success(BILL_MESSAGES.CREATE_SUCCESS);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || BILL_MESSAGES.CREATE_ERROR);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => BillApi.update(id, data),
    onSuccess: (_, variables) => {
      invalidateAll();
      queryClient.invalidateQueries({ queryKey: billKeys.detail(variables.id) });
      toast.success(BILL_MESSAGES.UPDATE_SUCCESS);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || BILL_MESSAGES.UPDATE_ERROR);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => BillApi.delete(id),
    onSuccess: () => {
      invalidateAll();
      toast.success(BILL_MESSAGES.DELETE_SUCCESS);
    },
    onError: () => toast.error(BILL_MESSAGES.DELETE_ERROR),
  });

  const confirmAndDelete = async (id) => {
    const confirm = await toast.confirm(BILL_DELETE_CONFIRM);
    if (confirm.isConfirmed) {
      return deleteMutation.mutateAsync(id);
    }
    return false;
  };

  return {
    create: createMutation.mutateAsync,
    isCreating: createMutation.isPending,

    update: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,

    delete: deleteMutation.mutateAsync,
    confirmAndDelete,
    isDeleting: deleteMutation.isPending,

    isSubmitting:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
  };
}

export default useBillMutations;