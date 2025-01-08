import { getUsers } from "~/lib/api/users/getUsers";
import { useLoaderData } from "@remix-run/react";
import { DataTable } from "~/components/shared/dataTable";
import { columns, UserRow } from "./columns";
import { AddItemToTable } from "~/components/shared/addItemToTable";
import invariant from "tiny-invariant";
import { PRIVILEGES } from "~/lib/constants";

export async function loader() {
  const { data: users, errors } = await getUsers();

  if (errors && Object.values(errors).length > 0) {
    throw new Error("Error al cargar usuarios");
  }

  invariant(users);
  return users.filter((u) => u.privilege === PRIVILEGES.Cliente);
}

export default function ClientsPage() {
  const clients = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto py-10">
      <AddItemToTable text="Clientes" />
      <DataTable
        columns={columns}
        data={clients as UserRow[]}
        text="Clientes"
      />
    </div>
  );
}
