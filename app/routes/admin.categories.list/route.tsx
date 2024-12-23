import { AddItemToTable } from "~/components/shared/addItemToTable";
import { columns } from "./columns";
import { DataTable } from "~/components/shared/dataTable";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getCategories } from "~/lib/api/categories/getCategories";

export async function loader() {
  const { data, errors } = await getCategories();

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
      <AddItemToTable href="/admin/categories/create" text="Categorías" />
      <DataTable columns={columns} data={categories} text="Categorías" />
    </section>
  );
}
