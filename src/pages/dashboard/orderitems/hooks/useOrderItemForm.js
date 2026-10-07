
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  orderItemSchema,
  toOrderItemPayload,
  toUpdatePayload,
} from "../schemas/orderItemSchema";
import { ORDER_ITEM_MESSAGES } from "../constants/messages";
import { normalizeSearchText } from "../utils/formatters";
import { toast } from "@/lib/toast";
import { useOrderItemMutations } from "./useOrderItemMutations";

const DEFAULT_FORM = {
  orderId: "",
  productId: "",
  quantity: "",
  price: "",
  subtotal: "",
};

/**
 * Hook quản lý form order item (dùng chung Create & Edit)
 */
export function useOrderItemForm({ id = null, initialData = null, onSuccess, onClose } = {}) {
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({ ...DEFAULT_FORM });
  const [originalData, setOriginalData] = useState(null);
  const [productSearch, setProductSearch] = useState("");
  const [errors, setErrors] = useState({});

  const {
    create,
    update,
    changeProduct,
    isSubmitting,
  } = useOrderItemMutations();

  const initializedRef = useRef(false);

  // ============ INIT: EDIT MODE ============
  useEffect(() => {
    if (isEditMode && initialData && !initializedRef.current) {
      const data = {
        orderId: String(
          initialData.orderId || initialData.order?.id || ""
        ),
        productId: String(
          initialData.productId || initialData.product?.id || ""
        ),
        quantity: String(initialData.quantity || ""),
        price: String(initialData.price || ""),
        subtotal: String(initialData.subtotal || ""),
      };
      setFormData(data);
      setOriginalData(data);
      initializedRef.current = true;
    }
  }, [isEditMode, initialData]);

  useEffect(() => {
    if (!isEditMode) initializedRef.current = false;
  }, [isEditMode]);

  // ============ CHANGE HANDLERS ============
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  const handleSelectChange = useCallback((name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  const handleProductChange = useCallback((productId, products) => {
    setFormData((prev) => ({ ...prev, productId }));
    const product = products.find((p) => String(p.id) === String(productId));
    if (product?.price) {
      setFormData((prev) => ({ ...prev, price: String(product.price) }));
    }
  }, []);

  const resetForm = useCallback(() => {
    setFormData({ ...DEFAULT_FORM });
    setOriginalData(null);
    setProductSearch("");
    setErrors({});
    initializedRef.current = false;
  }, []);

  // ============ PRODUCT SEARCH ============
  const filterProducts = useCallback(
    (products) => {
      if (!productSearch.trim()) return products;
      const normalizedTerm = normalizeSearchText(productSearch);
      return products.filter((p) => {
        const normalizedName = normalizeSearchText(p.name);
        return normalizedName.includes(normalizedTerm);
      });
    },
    [productSearch]
  );

  // ============ VALIDATE ============
  const validate = useCallback(() => {
    const result = orderItemSchema.safeParse(formData);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  }, [formData]);

  // ============ CONFIRM PRODUCT CHANGE ============
  const confirmProductChange = useCallback(
    async (products) => {
      const oldProduct = products.find(
        (p) => String(p.id) === String(originalData?.productId)
      );
      const newProduct = products.find(
        (p) => String(p.id) === String(formData.productId)
      );

      const Swal = (await import("sweetalert2")).default;
      const confirm = await Swal.fire({
        title: "⚠️ Thay đổi sản phẩm?",
        html: `
          <div class="text-left space-y-3">
            <div style="background:#fef3c7;border:1px solid #f59e0b;border-radius:8px;padding:12px">
              <p style="font-size:13px;color:#92400e;font-weight:600;margin:0 0 6px 0">Lưu ý quan trọng:</p>
              <p style="font-size:12px;color:#92400e;margin:0">Hệ thống sẽ XÓA item cũ và TẠO item mới vì backend không hỗ trợ đổi sản phẩm trực tiếp.</p>
            </div>
            <div style="background:#f9fafb;border-radius:8px;padding:12px">
              <div style="display:flex;gap:8px;margin-bottom:6px">
                <span style="font-size:12px;font-weight:600;color:#6b7280">Cũ:</span>
                <span style="font-size:13px;font-weight:700;color:#374151">${oldProduct?.name || "N/A"}</span>
              </div>
              <div style="display:flex;gap:8px">
                <span style="font-size:12px;font-weight:600;color:#6b7280">Mới:</span>
                <span style="font-size:13px;font-weight:700;color:#059669">${newProduct?.name || "N/A"}</span>
              </div>
            </div>
          </div>
        `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#8B5E3C",
        cancelButtonColor: "#ef4444",
        confirmButtonText: "Đồng ý thay đổi",
        cancelButtonText: "Hủy bỏ",
      });

      return confirm.isConfirmed;
    },
    [formData.productId, originalData?.productId]
  );

  // ============ SUBMIT ============
  const handleSubmit = useCallback(
    async (products = []) => {
      if (isSubmitting) return;

      if (!validate()) {
        toast.warning(ORDER_ITEM_MESSAGES.VALIDATION_ERROR);
        return;
      }

      const productChanged =
        isEditMode && String(formData.productId) !== String(originalData?.productId);

      // Confirm khi đổi sản phẩm
      if (productChanged) {
        const confirmed = await confirmProductChange(products);
        if (!confirmed) return;
      }

      try {
        if (!isEditMode) {
          // Create mode
          await create(toOrderItemPayload(formData));
        } else if (productChanged) {
          // Edit + product changed → delete + create
          await changeProduct({
            oldId: id,
            newData: toOrderItemPayload(formData),
          });
        } else {
          // Edit nhưng không đổi product → update bình thường
          await update({ id, data: toUpdatePayload(formData) });
        }

        resetForm();
        onClose?.();
        onSuccess?.();
      } catch {
        // Mutation đã show toast
      }
    },
    [
      isSubmitting,
      validate,
      formData,
      isEditMode,
      originalData?.productId,
      id,
      create,
      update,
      changeProduct,
      confirmProductChange,
      resetForm,
      onClose,
      onSuccess,
    ]
  );

  // ============ CLOSE ============
  const handleClose = useCallback(() => {
    if (isSubmitting) return;
    if (!isEditMode) resetForm();
    setProductSearch("");
    onClose?.();
  }, [isSubmitting, isEditMode, resetForm, onClose]);

  // ============ CHANGE DETECTION ============
  const changes = useMemo(() => {
    if (!isEditMode || !originalData) {
      return {
        hasChanges: false,
        orderChanged: false,
        productChanged: false,
        quantityChanged: false,
        priceChanged: false,
        subtotalChanged: false,
      };
    }

    const orderChanged = formData.orderId !== originalData.orderId;
    const productChanged = formData.productId !== originalData.productId;
    const quantityChanged =
      String(formData.quantity) !== String(originalData.quantity);
    const priceChanged =
      String(formData.price) !== String(originalData.price);
    const subtotalChanged =
      String(formData.subtotal) !== String(originalData.subtotal);

    return {
      orderChanged,
      productChanged,
      quantityChanged,
      priceChanged,
      subtotalChanged,
      hasChanges:
        orderChanged ||
        productChanged ||
        quantityChanged ||
        priceChanged ||
        subtotalChanged,
    };
  }, [isEditMode, originalData, formData]);

  // ============ COMPUTED ============
  const calculatedSubtotal = useMemo(() => {
    if (formData.quantity && formData.price) {
      return Number(formData.quantity) * Number(formData.price);
    }
    return 0;
  }, [formData.quantity, formData.price]);

  const finalSubtotal =
    Number(formData.subtotal) > 0
      ? Number(formData.subtotal)
      : calculatedSubtotal;

  const canSubmit = isEditMode ? changes.hasChanges : true;

  return {
    // Data
    formData,
    errors,
    changes,
    isEditMode,
    productSearch,

    // Computed
    calculatedSubtotal,
    finalSubtotal,
    canSubmit,

    // State
    isSubmitting,

    // Actions
    handleInputChange,
    handleSelectChange,
    handleProductChange,
    setProductSearch,
    filterProducts,
    handleSubmit,
    handleClose,
    resetForm,
  };
}

export default useOrderItemForm;