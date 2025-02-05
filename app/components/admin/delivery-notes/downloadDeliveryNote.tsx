import React from "react";
import nProgress from "nprogress";
import { Button } from "~/components/ui/button";
import {
  DeliveryNoteInfoForPdf,
  generateDeliveryNoteDD,
  OrderInfoForPdf,
} from "~/lib/downloadPdf";
import { Card } from "~/components/ui/card";

type Props = {
  deliveryNote: DeliveryNoteInfoForPdf;
  order: OrderInfoForPdf;
};

export function DownloadDeliveryNote({ deliveryNote, order }: Props) {
  const [disabled, setDisabled] = React.useState(false);

  const downloadDeliveryNote = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    try {
      e.preventDefault();
      nProgress.start();
      setDisabled(true);
      const { default: pdfMake } = await import("pdfmake/build/pdfmake");
      await import("pdfmake/build/vfs_fonts");
      pdfMake
        .createPdf(generateDeliveryNoteDD(deliveryNote, order))
        .download(`nota-de-entrega-${deliveryNote.controlNumber}.pdf`);
    } catch (err) {
      console.error(err);
    } finally {
      setDisabled(false);
      nProgress.done();
    }
  };

  return (
    <Card className="p-4 flex flex-col">
      <h4 className="text-gray-700 mb-2">Descargar Nota de Entrega</h4>
      <Button type="button" onClick={downloadDeliveryNote} disabled={disabled}>
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
