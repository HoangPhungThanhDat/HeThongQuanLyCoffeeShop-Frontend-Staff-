
import { useState, useRef } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
} from "@material-tailwind/react";
import { DocumentArrowDownIcon, EyeIcon } from "@heroicons/react/24/outline";
import "sweetalert2/dist/sweetalert2.min.css";

import { InvoiceContent } from "./components/InvoiceContent";
import {
  useOrderItemsForBill,
  useBillQRCode,
  useBillPdfExport,
} from "./hooks/useBillPdf";

export function Show({ open, bill, onClose }) {
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const invoiceRef = useRef(null);

  // ⭐ Hook 1: Fetch order items
  const { orderItems, isLoading: loadingItems } = useOrderItemsForBill(
    bill?.orderId,
    { enabled: open && Boolean(bill?.orderId) }
  );

  // ⭐ Hook 2: Tạo QR code
  const qrCodeDataUrl = useBillQRCode(bill, orderItems);

  // ⭐ Hook 3: Export PDF
  const { exportPdf, isExporting } = useBillPdfExport(invoiceRef);

  if (!bill) return null;

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
          <InvoiceContent
            ref={invoiceRef}
            bill={bill}
            orderItems={orderItems}
            loadingItems={loadingItems}
            qrCodeDataUrl={qrCodeDataUrl}
          />
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
            onClick={() => exportPdf(bill.id)}
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

      {/* PDF Preview Dialog */}
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
          <InvoiceContent
            bill={bill}
            orderItems={orderItems}
            loadingItems={loadingItems}
            qrCodeDataUrl={qrCodeDataUrl}
          />
        </DialogBody>
        <DialogFooter className="flex gap-2 justify-end">
          <Button
            variant="gradient"
            color="brown"
            className="bg-[#8B5E3C] hover:bg-[#a4714b] flex items-center gap-2"
            onClick={() => exportPdf(bill.id)}
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