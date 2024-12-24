import { AddItemToTable } from "~/components/shared/addItemToTable";
import { columns } from "./columns";
import { DataTable } from "~/components/shared/dataTable";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getShippings } from "~/lib/api/shipping/getShippings";

export async function loader() {
  const { data, errors } = await getShippings();

  if (errors && Object.values(errors).length > 0) {
    throw new Error("Error loading brands");
  }

  invariant(data);
  return data;
}

export default function BrandsPage() {
  const categories = useLoaderData<typeof loader>();

  return (
    <section className="container mx-auto py-10">
      <AddItemToTable href="/admin/shippings/create" text="Opciones de envío" />
      <DataTable columns={columns} data={categories} text="Opciones de envío" />
    </section>
  );
}
