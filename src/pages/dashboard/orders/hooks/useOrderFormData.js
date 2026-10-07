
import { useQuery } from "@tanstack/react-query";
import TableAPI from "@/api/tableApi";
import EmployeeAPI from "@/api/userApi";
import PromotionAPI from "@/api/promotionApi";
import { ORDER_MESSAGES } from "../constants/messages";
import { toast } from "@/lib/toast";

export const orderFormDataKeys = {
  all: ["order-form-data"],
  tables: () => [...orderFormDataKeys.all, "tables"],
  employees: () => [...orderFormDataKeys.all, "employees"],
  promotions: () => [...orderFormDataKeys.all, "promotions"],
};

const ensureArray = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

export function useOrderFormData(options = {}) {
  const { enabled = true } = options;

  const tablesQuery = useQuery({
    queryKey: orderFormDataKeys.tables(),
    queryFn: async () => {
      const res = await TableAPI.getAll();
      return ensureArray(res.data);
    },
    enabled,
    staleTime: 5 * 60 * 1000,
    onError: () => toast.error(ORDER_MESSAGES.FETCH_TABLES_ERROR),
  });

  const employeesQuery = useQuery({
    queryKey: orderFormDataKeys.employees(),
    queryFn: async () => {
      const res = await EmployeeAPI.getAll();
      return ensureArray(res.data);
    },
    enabled,
    staleTime: 5 * 60 * 1000,
    onError: () => toast.error(ORDER_MESSAGES.FETCH_EMPLOYEES_ERROR),
  });

  const promotionsQuery = useQuery({
    queryKey: orderFormDataKeys.promotions(),
    queryFn: async () => {
      const res = await PromotionAPI.getAll();
      return ensureArray(res.data);
    },
    enabled,
    staleTime: 5 * 60 * 1000,
    onError: () => toast.error(ORDER_MESSAGES.FETCH_PROMOTIONS_ERROR),
  });

  return {
    tables: tablesQuery.data || [],
    employees: employeesQuery.data || [],
    promotions: promotionsQuery.data || [],
    isLoading:
      tablesQuery.isLoading ||
      employeesQuery.isLoading ||
      promotionsQuery.isLoading,
  };
}

export default useOrderFormData;