import { ColumnDef } from "@tanstack/react-table";
import { EditButton } from "~/components/shared/editButtonIcon";
import { DataTableColumnHeader } from "~/components/ui/table-header";
import { ORDER_STATUS, OrderValue } from "~/lib/constants";

export type OrderRow = {
  _id: string;
  status: number;
  total: number;
  createdAt: Date;
  client: {
    name: string;
  };
  seller?: {
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
      return <div className="">{client.name}</div>;
    },
  },
  {
    accessorKey: "client",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Vendedor" />
    ),
    cell: ({ row }) => {
      const seller: { name: string } = row.getValue("seller");
      return <div className="">{seller.name}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha de creación" />
    ),
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
        <EditButton href={`/admin/orders/${row.getValue("_id")}`} />
      </div>
    ),
  },
];

function mapStatusToText(status: OrderValue) {
  switch (status) {
    case ORDER_STATUS.pending:
      return "Pendiente";
    case ORDER_STATUS.check:
      return "En proceso";
    case ORDER_STATUS.paid:
      return "Pagado";
    case ORDER_STATUS.delivered:
      return "Entregado";
    case ORDER_STATUS.credit:
      return "Credito";
    case ORDER_STATUS.creditDelivered:
      return "Credito entregado";
    case ORDER_STATUS.creditPaid:
      return "Credito pagado";
    case ORDER_STATUS.canceled:
      return "Cancelado";
    default:
      return "Pendiente";
  }
}
