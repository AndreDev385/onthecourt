import { getUsers } from "~/lib/api/users";
import { User } from "../admin.users/route";
import { useLoaderData } from "@remix-run/react";
import { DataTable } from "~/components/shared/dataTable";
import { columns } from "./columns";
import { AddItemToTable } from "~/components/shared/addItemToTable";

export async function loader() {
  const users = await getUsers();
  return users.filter((u: User) => u.privilege === 0);
}

export default function ClientsPage() {
  const clients = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto py-10">
      <AddItemToTable text="Clientes" />
      <DataTable columns={columns} data={clients} text="Clientes" />
    </div>
  );
}
