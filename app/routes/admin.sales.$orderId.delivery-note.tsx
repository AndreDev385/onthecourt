import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  useActionData,
  useLoaderData,
  useRouteLoaderData,
} from "@remix-run/react";
import React from "react";
import invariant from "tiny-invariant";
import { DownloadDeliveryNote } from "~/components/admin/delivery-notes/downloadDeliveryNote";
import { DownloadInvoice } from "~/components/admin/delivery-notes/downloadInvoice";
import { GenerateInvoice } from "~/components/admin/delivery-notes/generateInvoice";
import { useToast } from "~/hooks/use-toast";
import { getDeliveryNote } from "~/lib/api/delivery-notes/getDeliveryNote";
import { createInvoice } from "~/lib/api/invoices/createInvoice";
import { getInvoice } from "~/lib/api/invoices/getInvoice";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const deliveryNoteId = formData.get("deliveryNoteId");
  const currencyId = formData.get("currencyId");
  const rate = formData.get("rate");

  const { errors } = await createInvoice({
    deliveryNoteId: String(deliveryNoteId),
    currencyId: String(currencyId),
    rate: Number(rate) * 100,
  });

  if (errors && Object.values(errors).length > 0) {
    console.log(errors);
    return {
      success: false,
      error: "Ha ocurrido un error al generar la factura",
    };
  }

  return { success: true };
}

export async function loader({ params }: LoaderFunctionArgs) {
  invariant(
    params.orderId,
    "Ha ocurrido un error al cargar la note de entrega"
  );
  const { data, errors } = await getDeliveryNote(params.orderId);
  if (errors && Object.values(errors).length > 0) {
    throw new Error("Ha ocurrido un error al cargar la note de entrega");
  }
  invariant(data, "Ha ocurrido un error al cargar la note de entrega");
  const { data: invoiceData } = await getInvoice(
    data.deliveryNote.controlNumber
  );
  return { ...data, invoice: invoiceData };
}

export default function DeliveryNoteSectionPage() {
  const { currencies, deliveryNote, invoice } = useLoaderData<typeof loader>();
  const data = useRouteLoaderData<{ order: Order }>(
    "routes/admin.sales.$orderId"
  );
  const { order } = data ?? {};
  invariant(order, "Ha ocurrido un error al obtener la orden");

  const actionData = useActionData<typeof action>();

  const { toast } = useToast();

  React.useEffect(
    function showToast() {
      if (actionData?.success) {
        toast({
          title: "Éxito",
          description: "La factura se generó correctamente",
        });
      } else if (actionData?.error) {
        toast({
          title: "Error",
          description: actionData?.error,
        });
      }
    },
    [actionData, toast]
  );

  return (
    <div className="flex flex-col gap-4">
      {!deliveryNote.generateBill ? (
        <GenerateInvoice
          currencies={currencies}
          generateBill={deliveryNote.generateBill}
          deliveryNoteId={deliveryNote._id}
        />
      ) : null}
      <DownloadDeliveryNote order={order} deliveryNote={deliveryNote} />
      {invoice ? (
        <DownloadInvoice invoice={invoice} order={invoice.order} />
      ) : null}
    </div>
  );
}

type Order = {
  _id: string;
  status: number;
  paid: boolean;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  commission: number;
  phone: string;
  products: {
    title: string;
    photo: string;
    variant1: string;
    variant2: string;
    variant3: string;
    price: number;
    quantity: number;
    location: {
      name: string;
    };
  }[];
  client: {
    name: string;
    email: string;
  };
  charges: {
    ref: string;
    bank: string;
    method: string;
    amount: number;
    createdAt: string;
  }[];
  updatedAt: string;
  createdAt: string;
};
