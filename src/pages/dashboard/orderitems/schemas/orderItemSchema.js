
import { z } from "zod";

export const orderItemSchema = z.object({
  orderId: z
    .union([z.string(), z.number()])
    .refine(
      (val) => val !== "" && val !== null && val !== undefined,
      "Vui lòng chọn đơn hàng!"
    ),

  productId: z
    .union([z.string(), z.number()])
    .refine(
      (val) => val !== "" && val !== null && val !== undefined,
      "Vui lòng chọn sản phẩm!"
    ),

  quantity: z
    .union([z.string(), z.number()])
    .transform((val) => (val === "" ? NaN : Number(val)))
    .refine((val) => !isNaN(val) && val > 0, "Số lượng phải lớn hơn 0!")
    .refine((val) => val <= 1000, "Số lượng không được vượt quá 1,000!"),

  price: z
    .union([z.string(), z.number()])
    .transform((val) => (val === "" ? NaN : Number(val)))
    .refine((val) => !isNaN(val) && val > 0, "Đơn giá phải lớn hơn 0!")
    .refine((val) => val <= 1_000_000_000, "Đơn giá không được vượt quá 1 tỷ!"),

  subtotal: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) => {
      if (val === "" || val === undefined || val === null) return 0;
      return Number(val);
    }),
});

/**
 * Payload cho create
 */
export function toOrderItemPayload(formData) {
  const calculatedSubtotal =
    Number(formData.price) * Number(formData.quantity);
  const finalSubtotal =
    Number(formData.subtotal) > 0
      ? Number(formData.subtotal)
      : calculatedSubtotal;

  return {
    order: { id: Number(formData.orderId) },
    product: { id: Number(formData.productId) },
    quantity: Number(formData.quantity),
    price: Number(formData.price),
    subtotal: finalSubtotal,
  };
}

/**
 * Payload cho update (không gửi order & product vì không đổi)
 */
export function toUpdatePayload(formData) {
  const calculatedSubtotal =
    Number(formData.price) * Number(formData.quantity);
  const finalSubtotal =
    Number(formData.subtotal) > 0
      ? Number(formData.subtotal)
      : calculatedSubtotal;

  return {
    quantity: Number(formData.quantity),
    price: Number(formData.price),
    subtotal: finalSubtotal,
  };
}