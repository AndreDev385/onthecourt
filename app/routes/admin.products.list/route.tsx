import { useLoaderData } from "@remix-run/react";
import { AddItemToTable } from "~/components/shared/addItemToTable";
import { columns } from "./columns";
import { DataTable } from "~/components/shared/dataTable";
import { getProducts } from "~/lib/api/products/getProducts";
import invariant from "tiny-invariant";

export async function loader() {
  const { data, errors } = await getProducts();

  if (errors && Object.values(errors).length > 0) {
    throw new Error("Error al cargar productos");
  }

  invariant(data, "Error al cargar productos");
  return data;
}

export default function ProductsPage() {
  const products = useLoaderData<typeof loader>();

  return (
    <section className="container mx-auto py-10">
      <AddItemToTable href="/admin/products/create" text="Productos" />
      <DataTable columns={columns} data={products} text="Productos" />
    </section>
  );
}
