import { ColumnDef } from "@tanstack/react-table";
import { EditButton } from "~/components/shared/editButtonIcon";
import { DataTableColumnHeader } from "~/components/ui/table-header";

export type LocationRow = {
  _id: string;
  name: string;
  address: string;
};

export const columns: ColumnDef<LocationRow>[] = [
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
    accessorKey: "address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Dirección" />
    ),
  },
  {
    accessorKey: "_id",
    header: "Acciones",
    cell: ({ row }) => (
      <div className="flex">
        <EditButton href={`/admin/locations/${row.getValue("_id")}`} />
      </div>
    ),
  },
];
