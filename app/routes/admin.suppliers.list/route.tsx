import { useLoaderData } from "@remix-run/react";
import { AddItemToTable } from "~/components/shared/addItemToTable";
import { columns } from "./columns";
import { DataTable } from "~/components/shared/dataTable";
import { getSuppliers } from "~/lib/api/suppliers/getSuppliers";
import invariant from "tiny-invariant";

export async function loader() {
  const { data, errors } = await getSuppliers();

  if (errors && Object.values(errors).length > 0) {
    throw new Error("Error al cargar proveedores");
  }

  invariant(data, "Error al cargar proveedores");
  return data;
}

export default function SuppliersPage() {
  const suppliers = useLoaderData<typeof loader>();

  return (
    <section className="container mx-auto py-10">
      <AddItemToTable href="/admin/suppliers/create" text="Proveedores" />
      <DataTable columns={columns} data={suppliers} text="Proveedores" />
    </section>
  );
}
