import { ColumnDef } from "@tanstack/react-table";
import { EditButton } from "~/components/shared/editButtonIcon";
import { DataTableColumnHeader } from "~/components/ui/table-header";

export type CategoryRow = {
  _id: string;
  name: string;
};

export const columns: ColumnDef<CategoryRow>[] = [
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
    accessorKey: "_id",
    header: "Acciones",
    cell: ({ row }) => (
      <div className="flex">
        <EditButton href={`/admin/categories/${row.getValue("_id")}`} />
      </div>
    ),
  },
];
