import { useLoaderData } from "@remix-run/react";
import { getUsers } from "~/lib/api/users/getUsers";
import { columns, UserRow } from "./columns";
import { DataTable } from "../../components/shared/dataTable";
import { AddItemToTable } from "~/components/shared/addItemToTable";
import invariant from "tiny-invariant";

export async function loader() {
  const { data: users, errors } = await getUsers();

  if (errors && Object.values(errors).length > 0) {
    throw new Error("Error al cargar usuarios");
  }

  invariant(users);

  return users.filter((u) => u.privilege === 0);
}

export default function UsersPage() {
  const users = useLoaderData<typeof loader>();

  return (
    <section className="container mx-auto py-10">
      <AddItemToTable href="/admin/users/create" text="Usuarios" />
      <DataTable columns={columns} data={users as UserRow[]} text="Usuarios" />
    </section>
  );
}
