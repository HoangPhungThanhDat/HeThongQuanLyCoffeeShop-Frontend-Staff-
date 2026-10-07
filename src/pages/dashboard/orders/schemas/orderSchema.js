
import { z } from "zod";

export const orderSchema = z.object({
  tableId: z
    .union([z.string(), z.number()])
    .refine(
      (val) => val !== "" && val !== null && val !== undefined,
      "Vui lòng chọn bàn!"
    ),

  employeeId: z
    .union([z.string(), z.number()])
    .refine(
      (val) => val !== "" && val !== null && val !== undefined,
      "Vui lòng chọn nhân viên!"
    ),

  promotionId: z.union([z.string(), z.number()]).optional().nullable(),

  totalAmount: z
    .union([z.string(), z.number()])
    .transform((val) => (val === "" ? NaN : Number(val)))
    .refine((val) => !isNaN(val) && val > 0, "Tổng tiền phải lớn hơn 0!")
    .refine((val) => val <= 1_000_000_000, "Tổng tiền không được vượt quá 1 tỷ!"),

  status: z.enum(
    ["PENDING", "CONFIRMED", "PREPARING", "SERVED", "PAID", "CANCELLED"],
    { errorMap: () => ({ message: "Trạng thái không hợp lệ!" }) }
  ),

  notes: z
    .string()
    .max(500, "Ghi chú không được vượt quá 500 ký tự!")
    .optional()
    .or(z.literal("")),
});

/**
 * Chuyển formData → payload gửi API
 */
export function toOrderPayload(formData) {
  return {
    table: { id: formData.tableId },
    employee: { id: formData.employeeId },
    promotion: formData.promotionId ? { id: formData.promotionId } : null,
    totalAmount: parseFloat(formData.totalAmount),
    status: formData.status,
    notes: formData.notes?.trim() || "",
  };
}

/**
 * Payload cho update status (chỉ update status, giữ nguyên các field khác)
 * Backend yêu cầu full object → phải gửi đủ các field
 */
export function toStatusUpdatePayload(currentOrder, newStatus) {
  return {
    tableId: currentOrder.table?.id || currentOrder.tableId,
    employeeId: currentOrder.employee?.id || currentOrder.employeeId,
    promotionId: currentOrder.promotion?.id || currentOrder.promotionId,
    status: newStatus,
    notes: currentOrder.notes,
    totalAmount: currentOrder.totalAmount,
  };
}