
import { z } from "zod";

export const billSchema = z.object({
  orderId: z
    .union([z.string(), z.number()])
    .refine(
      (val) => val !== "" && val !== null && val !== undefined,
      "Vui lòng chọn đơn hàng!"
    ),

  totalAmount: z
    .union([z.string(), z.number()])
    .transform((val) => (val === "" ? NaN : Number(val)))
    .refine((val) => !isNaN(val) && val > 0, "Tổng tiền phải lớn hơn 0!")
    .refine((val) => val <= 1_000_000_000, "Tổng tiền không được vượt quá 1 tỷ!"),

  paymentMethod: z.enum(["CASH", "CARD", "MOBILE"], {
    errorMap: () => ({ message: "Phương thức thanh toán không hợp lệ!" }),
  }),

  paymentStatus: z.enum(["PENDING", "COMPLETED", "FAILED"], {
    errorMap: () => ({ message: "Trạng thái thanh toán không hợp lệ!" }),
  }),

  notes: z
    .string()
    .max(500, "Ghi chú không được vượt quá 500 ký tự!")
    .optional()
    .or(z.literal("")),

  issuedAt: z.string().optional().or(z.literal("")),
});

/**
 * Chuyển formData → payload gửi API
 */
export function toBillPayload(formData) {
  return {
    order: { id: parseInt(formData.orderId) },
    totalAmount: parseFloat(formData.totalAmount),
    paymentMethod: formData.paymentMethod,
    paymentStatus: formData.paymentStatus,
    notes: formData.notes?.trim() || "",
    issuedAt: formData.issuedAt || new Date().toISOString(),
  };
}