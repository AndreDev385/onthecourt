import { AddItemToTable } from "~/components/shared/addItemToTable";
import { DataTable } from "~/components/shared/dataTable";
import { columns } from "./columns";
import { useLoaderData } from "@remix-run/react";
import { getOrders } from "~/lib/api/orders/getOrders";
import invariant from "tiny-invariant";

export async function loader() {
  const { data, errors } = await getOrders();

  if (errors && Object.values(errors).length > 0) {
    throw new Error("Error al cargar ordenes");
  }
  invariant(data, "Error al cargar ordenes");
  return data;
}

export default function OrdersPage() {
  const orders = useLoaderData<typeof loader>();

  return (
    <section className="container mx-auto py-10">
      <AddItemToTable text="Ordenes" />
      <DataTable columns={columns} data={orders} text="Ordenes" />
    </section>
  );
}
