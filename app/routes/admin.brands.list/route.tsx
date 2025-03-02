import { AddItemToTable } from "~/components/shared/addItemToTable";
import { columns } from "./columns";
import { DataTable } from "~/components/shared/dataTable";
import { useLoaderData } from "@remix-run/react";
import { getBrands } from "~/lib/api/brands/getBrands";
import invariant from "tiny-invariant";

export async function loader() {
  const { data, errors } = await getBrands();

  if (errors && Object.values(errors).length > 0) {
    throw new Error("Error loading brands");
  }

  invariant(data);
  return data;
}

export default function BrandsPage() {
  const brands = useLoaderData<typeof loader>();

  return (
    <section className="container mx-auto py-10">
      <AddItemToTable href="/admin/brands/create" text="Marcas" />
      <DataTable columns={columns} data={brands} text="Marcas" />
    </section>
  );
}
