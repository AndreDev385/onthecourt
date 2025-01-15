import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import ChargeCard from "~/components/admin/orders/chargeCard";
import { ClientCard } from "~/components/admin/orders/clientCard";
import { ProductTable } from "~/components/admin/orders/productTable";
import { StatusCard } from "~/components/admin/orders/statusCard";
import { getDeliveryNote } from "~/lib/api/delivery-notes/getDeliveryNote";

export async function loader({ params }: LoaderFunctionArgs) {
  invariant(params.controlNumber, "Error al cargar nota de entrega");
  const { data, errors } = await getDeliveryNote(params.controlNumber);
  if (errors && Object.values(errors).length > 0) {
    throw new Error("Error al cargar nota de entrega");
  }
  invariant(data, "Error al cargar nota de entrega");
  return data;
}

export default function EditDeliveryNote() {
  const { deliveryNote, currencies } = useLoaderData<typeof loader>();

  return (
    <div className="mt-8">
      <section className="flex flex-col flex-wrap mx-auto px-4">
        <article className="grid grid-cols-1 md:grid-cols-[1fr,0.5fr] gap-4 w-full">
          <div className="w-full flex flex-col gap-4">
            <ProductTable order={deliveryNote.order} />
            <StatusCard
              status={deliveryNote.order.status}
              paid={deliveryNote.order.paid}
              _id={deliveryNote.order._id}
            />
            {order?.status !== 7 && <CancelOrder _id={order._id} />}
          </div>
          <div className="w-full flex flex-col gap-4 order-first md:order-last">
            <ClientCard
              name={order.client.name ?? ""}
              email={order.client.email ?? ""}
              phone={order.phone ?? ""}
            />
            <ChargeCard charges={order.charges} />
          </div>
        </article>
      </section>
    </div>
  );
}
