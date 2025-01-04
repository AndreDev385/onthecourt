import { ColumnDef } from "@tanstack/react-table";
import { EditButton } from "~/components/shared/editButtonIcon";
import { DataTableColumnHeader } from "~/components/ui/table-header";

export type ProductRow = {
  _id: string;
  title: string;
  active: boolean;
  isService: boolean;
  photos: string[];
  brand: {
    name: string;
  };
};

export const columns: ColumnDef<ProductRow>[] = [
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
    header: "Imagen",
    accessorKey: "photos",
    cell: ({ row }) => {
      const photos: string[] = row.getValue("photos");
      const title = row.getValue("title");

      return (
        <img
          className="w-16 h-16 rounded object-cover object-center"
          alt={`${title}`}
          src={photos ? photos[0] : ""}
        />
      );
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Titulo" />;
    },
  },
  {
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Marca" />;
    },
    accessorKey: "brand",
    cell: ({ row }) => {
      const brand: { name: string } | undefined = row.getValue("brand");

      return <div>{brand ? brand.name : "Servicio"}</div>;
    },
  },
  {
    header: "Acciones",
    accessorKey: "_id",
    cell: ({ row }) => (
      <div className="flex">
        <EditButton href={`/admin/products/${row.getValue("_id")}`} />
      </div>
    ),
  },
];
