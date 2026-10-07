// src/pages/dashboard/orders/hooks/useOrderForm.js
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { orderSchema, toOrderPayload } from "../schemas/orderSchema";
import { ORDER_MESSAGES } from "../constants/messages";
import { toast } from "@/lib/toast";
import { useOrderMutations } from "./useOrderMutations";

const DEFAULT_FORM = {
  tableId: "",
  employeeId: "",
  promotionId: "",
  totalAmount: "",
  status: "PENDING",
  notes: "",
};

export function useOrderForm({ id = null, initialData = null, onSuccess, onClose } = {}) {
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({ ...DEFAULT_FORM });
  const [originalData, setOriginalData] = useState(null);
  const [errors, setErrors] = useState({});

  const { create, update, isSubmitting } = useOrderMutations();
  const initializedRef = useRef(false);

  useEffect(() => {
    if (isEditMode && initialData && !initializedRef.current) {
      const data = {
        tableId: initialData.table?.id?.toString() || "",
        employeeId: initialData.employee?.id?.toString() || "",
        promotionId: initialData.promotion?.id?.toString() || "",
        totalAmount: String(initialData.totalAmount || ""),
        status: initialData.status || "PENDING",
        notes: initialData.notes || "",
      };
      setFormData(data);
      setOriginalData(data);
      initializedRef.current = true;
    }
  }, [isEditMode, initialData]);

  useEffect(() => {
    if (!isEditMode) initializedRef.current = false;
  }, [isEditMode]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  const handleSelectChange = useCallback((name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({ ...DEFAULT_FORM });
    setOriginalData(null);
    setErrors({});
    initializedRef.current = false;
  }, []);

  const validate = useCallback(() => {
    const result = orderSchema.safeParse(formData);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  }, [formData]);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    if (!validate()) {
      toast.warning(ORDER_MESSAGES.VALIDATION_ERROR);
      return;
    }

    try {
      const payload = toOrderPayload(formData);

      if (isEditMode) {
        await update({ id, data: payload });
      } else {
        await create(payload);
      }

      resetForm();
      onClose?.();
      onSuccess?.();
    } catch {
      // Mutation đã show toast
    }
  }, [
    isSubmitting,
    validate,
    formData,
    isEditMode,
    id,
    create,
    update,
    resetForm,
    onClose,
    onSuccess,
  ]);

  const handleClose = useCallback(() => {
    if (isSubmitting) return;
    if (!isEditMode) resetForm();
    onClose?.();
  }, [isSubmitting, isEditMode, resetForm, onClose]);

  const changes = useMemo(() => {
    if (!isEditMode || !originalData) {
      return {
        hasChanges: false,
        tableChanged: false,
        employeeChanged: false,
        promotionChanged: false,
        amountChanged: false,
        statusChanged: false,
        notesChanged: false,
      };
    }

    const tableChanged = formData.tableId !== originalData.tableId;
    const employeeChanged = formData.employeeId !== originalData.employeeId;
    const promotionChanged =
      (formData.promotionId || "") !== (originalData.promotionId || "");
    const amountChanged =
      String(formData.totalAmount) !== String(originalData.totalAmount);
    const statusChanged = formData.status !== originalData.status;
    const notesChanged = formData.notes !== originalData.notes;

    return {
      tableChanged,
      employeeChanged,
      promotionChanged,
      amountChanged,
      statusChanged,
      notesChanged,
      hasChanges:
        tableChanged ||
        employeeChanged ||
        promotionChanged ||
        amountChanged ||
        statusChanged ||
        notesChanged,
    };
  }, [isEditMode, originalData, formData]);

  const formattedTotal = useMemo(() => {
    if (!formData.totalAmount) return null;
    const num = parseFloat(formData.totalAmount);
    if (isNaN(num) || num <= 0) return null;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(num);
  }, [formData.totalAmount]);

  const canSubmit = isEditMode ? changes.hasChanges : true;

  return {
    formData,
    errors,
    changes,
    isEditMode,
    formattedTotal,
    canSubmit,
    isSubmitting,
    handleInputChange,
    handleSelectChange,
    handleSubmit,
    handleClose,
    resetForm,
  };
}

export default useOrderForm;