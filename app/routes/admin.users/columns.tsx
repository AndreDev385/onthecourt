import { ColumnDef } from "@tanstack/react-table";
import { EditButton } from "~/components/shared/editButtonIcon";
import { DataTableColumnHeader } from "~/components/ui/table-header";

export type UserRow = {
  name: string;
  email: string;
  active: boolean;
  privilege: string;
};

function mapPrivilege(privilege: number): string {
  switch (privilege) {
    case 0:
      return "Cliente";
    case 1:
      return "Administrador";
    case 2:
      return "Editor";
    case 3:
      return "Lector";
    default:
      return "Usuario";
  }
}

export const columns: ColumnDef<UserRow>[] = [
  {
    accessorKey: "active",
    header: "",
    cell: ({ row }) => {
      const active = row.getValue("active");

      return (
        <div className="flex justify-center">
          <div
            className={`h-2 w-2 mr-1 inline-block rounded-full ${
              active ? "bg-green-700" : "bg-red-700"
            }`}
          >
            <span className="sr-only">{active ? "Activo" : "Eliminado"}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "privilege",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Privilegio" />
    ),
    cell: ({ row }) => mapPrivilege(row.getValue("privilege")),
  },
  {
    accessorKey: "_id",
    header: "Acciones",
    cell: ({ row }) => (
      <div className="flex">
        <EditButton href={`/admin/users/${row.getValue("_id")}`} />
      </div>
    ),
  },
];
