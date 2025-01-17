import React from "react";
import nProgress from "nprogress";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import {
  generateInvoiceDD,
  InvoiceInfoForPdf,
  OrderInfoForPdf,
} from "~/lib/downloadPdf";

interface DownloadBillProps {
  invoice: InvoiceInfoForPdf;
  order: OrderInfoForPdf;
}

export function DownloadInvoice({ invoice, order }: DownloadBillProps) {
  const [disabled, setDisabled] = React.useState(false);
  const downloadBill = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    try {
      e.preventDefault();
      nProgress.start();
      setDisabled(true);
      const { default: pdfMake } = await import("pdfmake/build/pdfmake");
      await import("pdfmake/build/vfs_fonts");
      pdfMake
        .createPdf(generateInvoiceDD(invoice, order))
        .download(`factura-${invoice.controlNumber}.pdf`);
    } catch (err) {
      console.log(err);
    } finally {
      setDisabled(false);
      nProgress.done();
    }
  };
  return (
    <Card className="p-4 flex flex-col">
      <h2 className="text-gray-700 mb-2">Descargar Factura</h2>
      <Button type="button" onClick={downloadBill} disabled={disabled}>
        <span className="flex flex-row flex-wrap w-full h-full">
          <svg
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-4 h-4 my-auto mr-1"
          >
            <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Descargar
        </span>
      </Button>
    </Card>
  );
}
