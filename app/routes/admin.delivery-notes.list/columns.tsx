import { ColumnDef } from "@tanstack/react-table";
import { EditButton } from "~/components/shared/editButtonIcon";
import { Badge } from "~/components/ui/badge";
import { DataTableColumnHeader } from "~/components/ui/table-header";
import { format } from "date-fns";

type DeliveryNoteRow = {
  _id: string;
  controlNumber: string;
  paid: boolean;
  createdAt: string;
};

export const columns: ColumnDef<DeliveryNoteRow>[] = [
  {
    accessorKey: "controlNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Número de control" />
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha de creación" />
    ),
    cell: ({ row }) => (
      <div>{format(row.getValue("createdAt"), "dd/MM/yyyy")}</div>
    ),
  },
  {
    accessorKey: "paid",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => {
      const paid = row.getValue("paid");
      return (
        <div className="">
          {paid ? (
            <Badge className="p-2 bg-green-700">Pagado</Badge>
          ) : (
            <Badge variant="destructive" className="p-2">
              Por pagar
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "_id",
    header: "Acciones",
    cell: ({ row }) => (
      <div className="flex">
        <EditButton
          href={`/admin/delivery-notes/${row.getValue("controlNumber")}`}
        />
      </div>
    ),
  },
];
