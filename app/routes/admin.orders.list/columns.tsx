import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "~/components/ui/table-header";
import { OrderValue } from "~/lib/constants";
import { format } from "date-fns";
import { Eye } from "lucide-react";
import { Link } from "@remix-run/react";
import { mapStatusToText } from "~/lib/utils";

export type OrderRow = {
  _id: string;
  status: number;
  total: number;
  createdAt: Date;
  client: {
    name: string;
  };
};

export const columns: ColumnDef<OrderRow>[] = [
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status");
      return <div className="">{mapStatusToText(status as OrderValue)}</div>;
    },
  },
  {
    accessorKey: "client",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cliente" />
    ),
    cell: ({ row }) => {
      const client: { name: string } = row.getValue("client");
      return <div className="">{client?.name}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha de creación" />
    ),
    cell: ({ row }) => {
      const createdAt: Date = row.getValue("createdAt");
      return <div className="">{format(createdAt, "dd/MM/yyyy")}</div>;
    },
  },
  {
    accessorKey: "total",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total" />
    ),
    cell: ({ row }) => (
      <div className="">
        {((row.getValue("total") as number) / 100).toFixed(2)}
      </div>
    ),
  },
  {
    accessorKey: "_id",
    header: "Acciones",
    cell: ({ row }) => (
      <div className="flex">
        <Link
          to={`/admin/sales/${row.getValue("_id")}/order`}
          prefetch="intent"
        >
          <Eye />
        </Link>
      </div>
    ),
  },
];
