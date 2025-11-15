import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
} from "@material-tailwind/react";
import { useState, useRef, useEffect } from "react";
import { DocumentArrowDownIcon, EyeIcon } from "@heroicons/react/24/outline";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import QRCode from "qrcode";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import OrderItemAPI from "@/api/orderitemApi";

export function Show({ open, bill, onClose }) {
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const invoiceRef = useRef(null);

  // ✅ Fetch danh sách sản phẩm của đơn hàng
  useEffect(() => {
    if (open && bill?.orderId) {
      const fetchOrderItems = async () => {
        try {
          setLoading(true);
          const response = await OrderItemAPI.getByOrderId(bill.orderId);
          setOrderItems(response.data || response || []);
        } catch (error) {
          console.error("Lỗi khi lấy order items:", error);
          setOrderItems([]);
        } finally {
          setLoading(false);
        }
      };
      fetchOrderItems();
    }
  }, [open, bill?.orderId]);

  // Tạo mã QR
  //  QR code an toàn, quét được trên mọi thiết bị
    useEffect(() => {
      const generateQR = async () => {
        try {
          if (!bill?.id || !orderItems.length) return;

          // Giới hạn danh sách sản phẩm (tránh QR quá dài)
          const itemsText = orderItems
            .slice(0, 5)
            .map(
              (item) =>
                `${item.product?.name || "SP"} x${item.quantity} (${item.subtotal}đ)`
            )
            .join("; ");

          // Nếu > 5 sản phẩm, ghi chú thêm
          const moreText =
            orderItems.length > 5 ? `... +${orderItems.length - 5} sản phẩm khác` : "";

          // Nội dung QR (chỉ ký tự ASCII, không emoji)
                  const qrValue = `
            HOA DON: ${bill.id}
            DON HANG: ${bill.orderId}
            NGAY: ${formatDate(bill.issuedAt)}
            TONG CONG: ${bill.totalAmount} VND
            SAN PHAM: ${itemsText} ${moreText}
            THANH TOAN: ${getPaymentMethodLabel(bill.paymentMethod)}
            TRANG THAI: ${getPaymentStatusInfo(bill.paymentStatus).label}
            #CoffeeShop - 85 Phan Ke Binh Q1
                  `
            .trim()
            .replace(/\s+/g, " "); // loại bỏ khoảng trắng dư

          const dataUrl = await QRCode.toDataURL(qrValue, {
            errorCorrectionLevel: "M",
            type: "image/png",
            width: 180, // tăng kích thước QR
            margin: 2,
            color: { dark: "#000000", light: "#FFFFFF" },
          });

          setQrCodeDataUrl(dataUrl);
        } catch (error) {
          console.error("❌ Lỗi tạo QR:", error);
        }
      };

      if (bill?.id && open) generateQR();
    }, [
      bill?.id,
      bill?.orderId,
      bill?.totalAmount,
      bill?.paymentMethod,
      bill?.paymentStatus,
      open,
      orderItems,
    ]);


  // =================== 🔧 Format Helper ====================
  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toLocaleString("vi-VN") : "N/A";
  const formatCurrency = (amount) =>
    amount
      ? new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(amount)
      : "0 đ";

  const paymentMethods = { CASH: "Tiền mặt", CARD: "Thẻ", MOBILE: "Ví điện tử" };
  const paymentStatuses = {
    PENDING: { label: "Chờ thanh toán", color: "bg-yellow-50 text-yellow-600" },
    COMPLETED: { label: "Đã thanh toán", color: "bg-green-50 text-green-600" },
    FAILED: { label: "Thất bại", color: "bg-red-50 text-red-600" },
  };
  const getPaymentMethodLabel = (m) => paymentMethods[m] || m;
  const getPaymentStatusInfo = (s) =>
    paymentStatuses[s] || { label: s, color: "bg-gray-50 text-gray-600" };

  // =================== 🧾 Xuất PDF ====================
  const handleExportPdf = async () => {
    try {
      setIsExporting(true);

      Swal.fire({
        title: "Đang tạo file PDF...",
        text: "Vui lòng đợi trong giây lát",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      await new Promise((r) => setTimeout(r, 300));

      if (!invoiceRef.current)
        throw new Error("Không tìm thấy phần hóa đơn để xuất PDF");

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

      pdf.save(`hoa-don-${bill.id}.pdf`);
      Swal.fire({
        icon: "success",
        title: "Xuất PDF thành công!",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Lỗi export PDF:", error);
      Swal.fire({
        icon: "error",
        title: "Xuất PDF thất bại",
        text: error.message,
      });
    } finally {
      setIsExporting(false);
    }
  };

  // =================== 🧩 Nội dung hóa đơn ====================
  const InvoiceContent = () => (
    <div
      ref={invoiceRef}
      className="bg-white p-6 w-full max-w-2xl shadow-lg rounded text-sm"
    >
      <div className="text-center mb-4 border-b-2 border-[#8B5E3C] pb-3">
        <h1 className="text-xl font-bold text-[#8B5E3C]">COFFEE SHOP</h1>
        <p className="text-xs text-gray-600">
          Địa chỉ: 85 Phan Kế Bính, P.Đa Kao, Quận 1, TP.HCM
        </p>
        <p className="text-xs text-gray-600">Điện thoại: 0123456789</p>
      </div>

      <h2 className="text-lg font-bold text-center mb-4 text-[#8B5E3C]">
        HÓA ĐƠN
      </h2>

      <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
        <div>
          <p>
            <strong>Mã hóa đơn:</strong> {bill.id}
          </p>
          <p>
            <strong>Mã đơn hàng:</strong> #{bill.orderId || "N/A"}
          </p>
        </div>
        <div className="text-right">
          <p>
            <strong>Ngày:</strong> {formatDate(bill.issuedAt)}
          </p>
          <p>
            <strong>Giờ:</strong>{" "}
            {new Date(bill.issuedAt).toLocaleTimeString("vi-VN")}
          </p>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <table className="w-full border-collapse mb-4 text-xs">
        <thead>
          <tr className="bg-[#8B5E3C] text-white">
            <th className="border border-gray-300 p-1 text-left">Sản phẩm</th>
            <th className="border border-gray-300 p-1 text-center">SL</th>
            <th className="border border-gray-300 p-1 text-right">Giá</th>
            <th className="border border-gray-300 p-1 text-right">
              Thành tiền
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan="4"
                className="text-center text-gray-500 border p-1"
              >
                Đang tải...
              </td>
            </tr>
          ) : orderItems.length > 0 ? (
            orderItems.map((item, i) => (
              <tr key={i}>
                <td className="border border-gray-300 p-1">
                  {item.product?.name || "N/A"}
                </td>
                <td className="border border-gray-300 p-1 text-center">
                  {item.quantity}
                </td>
                <td className="border border-gray-300 p-1 text-right">
                  {formatCurrency(item.price)}
                </td>
                <td className="border border-gray-300 p-1 text-right">
                  {formatCurrency(item.subtotal)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="4"
                className="text-center text-gray-500 border p-1"
              >
                Không có sản phẩm
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex gap-4 mb-4 text-xs">
        <div className="flex-shrink-0 flex flex-col items-center">
          {qrCodeDataUrl ? (
            <img
              src={qrCodeDataUrl}
              alt="QR Code"
              className="border border-gray-300 p-1 bg-white rounded w-20 h-20"
            />
          ) : (
            <div className="border border-gray-300 w-20 h-20 flex items-center justify-center bg-gray-100 text-gray-400 text-xs">
              QR
            </div>
          )}
          <p className="text-gray-600 mt-1 text-xs">Mã QR</p>
        </div>

        <div className="flex-1 flex justify-end">
          <div className="w-56 border-t-2 border-[#8B5E3C] pt-2">
            <div className="flex justify-between mb-1">
              <span>Tổng tiền:</span>
              <span className="font-bold">
                {formatCurrency(bill.totalAmount)}
              </span>
            </div>
            <div className="flex justify-between mb-1 text-gray-600">
              <span>Chiết khấu:</span>
              <span>0 đ</span>
            </div>
            <div className="flex justify-between border-t-2 border-[#8B5E3C] pt-1 font-bold text-[#8B5E3C]">
              <span>TỔNG CỘNG:</span>
              <span>{formatCurrency(bill.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-2 rounded mb-4 text-xs">
        <p>
          <strong>Phương thức thanh toán:</strong>{" "}
          {getPaymentMethodLabel(bill.paymentMethod)}
        </p>
        <p>
          <strong>Trạng thái:</strong>{" "}
          {getPaymentStatusInfo(bill.paymentStatus).label}
        </p>
        {bill.notes && (
          <p>
            <strong>Ghi chú:</strong> {bill.notes}
          </p>
        )}
      </div>

      <div className="text-center text-xs text-gray-600 border-t-2 border-[#8B5E3C] pt-2">
        <p>Cảm ơn bạn đã ghé thăm!</p>
        <p>Vui lòng giữ hóa đơn để đối chiếu khi cần</p>
      </div>
    </div>
  );

  // =================== ⚙️ Render Dialog ====================
  return (
    <>
      <Dialog open={open} handler={onClose} size="md">
        <DialogHeader className="bg-gradient-to-r from-[#8B5E3C] to-[#C89F77] text-white rounded-t-lg">
          Chi Tiết Hóa Đơn
        </DialogHeader>

        <DialogBody
          divider
          className="flex flex-col gap-4 bg-[#fffaf5] max-h-[70vh] overflow-y-auto"
        >
          <InvoiceContent />
        </DialogBody>

        <DialogFooter className="flex gap-2 justify-end">
          <Button
            variant="outlined"
            color="brown"
            className="border-[#8B5E3C] text-[#8B5E3C] flex items-center gap-2"
            onClick={() => setShowPdfPreview(true)}
          >
            <EyeIcon className="h-5 w-5" />
            Xem PDF
          </Button>
          <Button
            variant="gradient"
            color="brown"
            className="bg-[#8B5E3C] hover:bg-[#a4714b] flex items-center gap-2"
            onClick={handleExportPdf}
            disabled={isExporting}
          >
            <DocumentArrowDownIcon className="h-5 w-5" />
            {isExporting ? "Đang xuất..." : "Tải PDF"}
          </Button>
          <Button
            variant="text"
            color="brown"
            className="text-[#8B5E3C]"
            onClick={onClose}
          >
            Đóng
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Xem trước PDF */}
      <Dialog
        open={showPdfPreview}
        handler={() => setShowPdfPreview(false)}
        size="lg"
      >
        <DialogHeader className="bg-gradient-to-r from-[#8B5E3C] to-[#C89F77] text-white">
          Xem Trước Hóa Đơn
        </DialogHeader>
        <DialogBody
          divider
          className="flex justify-center bg-gray-100 p-4 max-h-[80vh] overflow-y-auto"
        >
          <InvoiceContent />
        </DialogBody>
        <DialogFooter className="flex gap-2 justify-end">
          <Button
            variant="gradient"
            color="brown"
            className="bg-[#8B5E3C] hover:bg-[#a4714b] flex items-center gap-2"
            onClick={handleExportPdf}
            disabled={isExporting}
          >
            <DocumentArrowDownIcon className="h-5 w-5" />
            {isExporting ? "Đang xuất..." : "Tải PDF"}
          </Button>
          <Button
            variant="text"
            color="brown"
            onClick={() => setShowPdfPreview(false)}
          >
            Đóng
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default Show;
