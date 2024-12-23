import { AddItemToTable } from "~/components/shared/addItemToTable";
import { columns } from "./columns";
import { DataTable } from "~/components/shared/dataTable";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getCurrencies } from "~/lib/api/currencies/getCurrencies";

export async function loader() {
  const { data, errors } = await getCurrencies();

  if (errors && Object.values(errors).length > 0) {
    throw new Error("Error loading brands");
  }

  invariant(data);
  return data;
}

export default function CurrenciesPage() {
  const currencies = useLoaderData<typeof loader>();

  return (
    <section className="container mx-auto py-10">
      <AddItemToTable href="/admin/currencies/create" text="Monedas" />
      <DataTable columns={columns} data={currencies} text="Monedas" />
    </section>
  );
}
