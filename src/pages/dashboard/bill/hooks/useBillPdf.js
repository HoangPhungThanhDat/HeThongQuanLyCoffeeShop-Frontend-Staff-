
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import QRCode from "qrcode";
import Swal from "sweetalert2";
import OrderItemAPI from "@/api/orderitemApi";
import { BILL_MESSAGES } from "../constants/messages";
import { formatPrice, formatDate } from "../utils/formatters";
import { getMethodConfig, getStatusConfig } from "../constants/billConfig";

/**
 * Query keys cho order items của bill
 */
export const billPdfKeys = {
  all: ["bill-pdf"],
  items: (orderId) => [...billPdfKeys.all, "items", orderId],
};

/**
 * Hook fetch order items của 1 đơn hàng (cho PDF)
 */
export function useOrderItemsForBill(orderId, { enabled = true } = {}) {
  const query = useQuery({
    queryKey: billPdfKeys.items(orderId),
    queryFn: async () => {
      const res = await OrderItemAPI.getByOrderId(orderId);
      return res.data || res || [];
    },
    enabled: enabled && Boolean(orderId),
    staleTime: 5 * 60 * 1000,
    onError: () => {
      console.error(BILL_MESSAGES.FETCH_ITEMS_ERROR);
    },
  });

  return {
    orderItems: query.data || [],
    isLoading: query.isLoading,
  };
}

/**
 * Hook tạo QR code từ bill + order items
 */
export function useBillQRCode(bill, orderItems) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");

  useEffect(() => {
    const generateQR = async () => {
      try {
        if (!bill?.id || !orderItems.length) return;

        const itemsText = orderItems
          .slice(0, 5)
          .map(
            (item) =>
              `${item.product?.name || "SP"} x${item.quantity} (${item.subtotal}đ)`
          )
          .join("; ");

        const moreText =
          orderItems.length > 5
            ? `... +${orderItems.length - 5} sản phẩm khác`
            : "";

        const methodConfig = getMethodConfig(bill.paymentMethod);
        const statusConfig = getStatusConfig(bill.paymentStatus);

        const qrValue = `
          HOA DON: ${bill.id}
          DON HANG: ${bill.orderId}
          NGAY: ${formatDate(bill.issuedAt)}
          TONG CONG: ${bill.totalAmount} VND
          SAN PHAM: ${itemsText} ${moreText}
          THANH TOAN: ${methodConfig.label}
          TRANG THAI: ${statusConfig.label}
          #CoffeeShop - 85 Phan Ke Binh Q1
        `
          .trim()
          .replace(/\s+/g, " ");

        const dataUrl = await QRCode.toDataURL(qrValue, {
          errorCorrectionLevel: "M",
          type: "image/png",
          width: 180,
          margin: 2,
          color: { dark: "#000000", light: "#FFFFFF" },
        });

        setQrCodeDataUrl(dataUrl);
      } catch (error) {
        console.error("❌ Lỗi tạo QR:", error);
      }
    };

    generateQR();
  }, [
    bill?.id,
    bill?.orderId,
    bill?.totalAmount,
    bill?.paymentMethod,
    bill?.paymentStatus,
    bill?.issuedAt,
    orderItems,
  ]);

  return qrCodeDataUrl;
}

/**
 * Hook xuất PDF từ 1 DOM ref
 */
export function useBillPdfExport(invoiceRef) {
  const [isExporting, setIsExporting] = useState(false);

  const exportPdf = async (billId) => {
    try {
      setIsExporting(true);

      Swal.fire({
        title: BILL_MESSAGES.PDF_EXPORTING,
        text: BILL_MESSAGES.PDF_EXPORTING_DESC,
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      await new Promise((r) => setTimeout(r, 300));

      if (!invoiceRef.current) {
        throw new Error(BILL_MESSAGES.PDF_NO_REF);
      }

      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= 297;
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= 297;
      }

      pdf.save(`hoa-don-${billId}.pdf`);
      Swal.fire({
        icon: "success",
        title: BILL_MESSAGES.PDF_EXPORT_SUCCESS,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Lỗi export PDF:", error);
      Swal.fire({
        icon: "error",
        title: BILL_MESSAGES.PDF_EXPORT_ERROR,
        text: error.message,
      });
    } finally {
      setIsExporting(false);
    }
  };

  return { exportPdf, isExporting };
}