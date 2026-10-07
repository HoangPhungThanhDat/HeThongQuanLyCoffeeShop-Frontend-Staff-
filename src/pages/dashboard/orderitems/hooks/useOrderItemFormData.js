
import { useQuery } from "@tanstack/react-query";
import OrderAPI from "@/api/orderApi";
import ProductAPI from "@/api/productApi";
import { ORDER_ITEM_MESSAGES } from "../constants/messages";
import { toast } from "@/lib/toast";

export const orderItemFormDataKeys = {
  all: ["order-item-form-data"],
  orders: () => [...orderItemFormDataKeys.all, "orders"],
  products: () => [...orderItemFormDataKeys.all, "products"],
};

const ensureArray = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

export function useOrderItemFormData(options = {}) {
  const { enabled = true } = options;

  const ordersQuery = useQuery({
    queryKey: orderItemFormDataKeys.orders(),
    queryFn: async () => {
      // ⭐ Orders API đã phân trang → lấy tất cả với size lớn
      const res = await OrderAPI.getAll({ page: 0, size: 1000 });
      return ensureArray(res.data);
    },
    enabled,
    staleTime: 5 * 60 * 1000,
    onError: () => toast.error(ORDER_ITEM_MESSAGES.FETCH_ORDERS_ERROR),
  });

  const productsQuery = useQuery({
    queryKey: orderItemFormDataKeys.products(),
    queryFn: async () => {
      // ⭐ Products API đã phân trang → lấy tất cả với size lớn
      const res = await ProductAPI.getAll({ page: 0, size: 1000 });
      return ensureArray(res.data);
    },
    enabled,
    staleTime: 5 * 60 * 1000,
    onError: () => toast.error(ORDER_ITEM_MESSAGES.FETCH_PRODUCTS_ERROR),
  });

  return {
    orders: ordersQuery.data || [],
    products: productsQuery.data || [],
    isLoading: ordersQuery.isLoading || productsQuery.isLoading,
  };
}

export default useOrderItemFormData;