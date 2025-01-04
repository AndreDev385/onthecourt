import { useLoaderData } from "@remix-run/react";
import { AddItemToTable } from "~/components/shared/addItemToTable";
import { columns } from "./columns";
import { DataTable } from "~/components/shared/dataTable";
import { getPromoCodes } from "~/lib/api/promoCodes/getPromoCodes";
import invariant from "tiny-invariant";

export async function loader() {
  const { data, errors } = await getPromoCodes();

  if (errors && Object.values(errors).length > 0) {
    throw new Error("Error al cargar códigos de promoción");
  }

  invariant(data);
  console.log(data, "data");
  return data;
}

export default function PromoCodesPage() {
  const promoCodes = useLoaderData<typeof loader>();

  return (
    <section className="container mx-auto py-10">
      <AddItemToTable
        href="/admin/promo-codes/create"
        text="Códigos de promoción"
      />
      <DataTable
        columns={columns}
        data={promoCodes}
        text="Códigos de promoción"
      />
    </section>
  );
}
