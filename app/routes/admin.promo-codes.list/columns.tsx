import { ColumnDef } from "@tanstack/react-table";
import { EditButton } from "~/components/shared/editButtonIcon";
import { DataTableColumnHeader } from "~/components/ui/table-header";

export type PromoCodeRow = {
  _id: string;
  name: string;
  code: string;
  discount: number;
  isFixed: boolean;
  active: boolean;
};

export const columns: ColumnDef<PromoCodeRow>[] = [
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
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Código" />
    ),
  },
  {
    accessorKey: "discount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Descuento" />
    ),
    cell: ({ row }) => {
      const discount: number = row.getValue("discount");
      const isFixed: boolean = row.getValue("isFixed");
      return (
        <div className="">
          {isFixed ? (discount * 100)?.toFixed(2) : discount?.toFixed(2)}
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo" />
    ),
    cell: ({ row }) => (
      <div className="">{row.getValue("isFixed") ? "Fijo" : "Porcentaje"}</div>
    ),
  },
  {
    accessorKey: "_id",
    header: "Acciones",
    cell: ({ row }) => (
      <div className="flex">
        <EditButton href={`/admin/promo-codes/${row.getValue("_id")}`} />
      </div>
    ),
  },
];
