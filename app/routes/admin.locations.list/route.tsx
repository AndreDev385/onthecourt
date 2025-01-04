import { AddItemToTable } from "~/components/shared/addItemToTable";
import { columns } from "./columns";
import { DataTable } from "~/components/shared/dataTable";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getLocations } from "~/lib/api/locations/getLocations";

export async function loader() {
  const { data, errors } = await getLocations();

  if (errors && Object.values(errors).length > 0) {
    throw new Error("Error al cargar marcas");
  }

  invariant(data, "Error al cargar marcas");
  return data;
}

export default function CurrenciesPage() {
  const locations = useLoaderData<typeof loader>();

  return (
    <section className="container mx-auto py-10">
      <AddItemToTable href="/admin/locations/create" text="Sucursales" />
      <DataTable columns={columns} data={locations} text="Sucursales" />
    </section>
  );
}
