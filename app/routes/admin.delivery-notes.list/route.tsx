import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { AddItemToTable } from "~/components/shared/addItemToTable";
import { getDeliveryNotes } from "~/lib/api/delivery-notes/getDeliveryNotes";
import { columns } from "./columns";
import { DataTable } from "~/components/shared/dataTable";

export async function loader() {
  const { data, errors } = await getDeliveryNotes();
  if (errors && Object.values(errors).length > 0) {
    throw new Error("Error al cargar notas de entrega");
  }
  invariant(data, "Error al cargar notas de entrega");

  return data;
}

export default function DeliveryNotesPage() {
  const deliveryNotes = useLoaderData<typeof loader>();
  console.log(deliveryNotes);

  return (
    <section className="container mx-auto py-10">
      <AddItemToTable href="/admin/delivery-notes/create" text="Sucursales" />
      <DataTable columns={columns} data={deliveryNotes} text="Sucursales" />
    </section>
  );
}
