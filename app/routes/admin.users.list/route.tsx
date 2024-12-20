import { useLoaderData } from "@remix-run/react";
import { getUsers } from "~/lib/api/users/getUsers";
import { columns } from "./columns";
import { DataTable } from "../../components/shared/dataTable";
import { AddItemToTable } from "~/components/shared/addItemToTable";

export type User = {
  _id: string;
  name: string;
  email: string;
  password: string;
  dni?: string;
  dniType?: string; //! 1V | 2E | 3J | 4G
  privilege: number; //! 0Client | 1SuperAdmin | 2Admin | ...
  slug?: string;
  resetToken?: string;
  resetTokenExpiry?: number;
  active?: boolean;
  commission?: number;
  client?: unknown;
  createdAt?: Date;
  updatedAt?: Date;
};

export async function loader() {
  const users = await getUsers();
  return users.filter((u: User) => u.privilege !== 0);
}

export default function UsersPage() {
  const users = useLoaderData<typeof loader>();

  return (
    <section className="container mx-auto py-10">
      <AddItemToTable href="/admin/users/create" text="Usuarios" />
      <DataTable columns={columns} data={users} text="Usuarios" />
    </section>
  );
}
