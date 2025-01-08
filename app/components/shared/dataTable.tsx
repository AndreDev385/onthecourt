import {
  ColumnDef,
  SortingState,
  flexRender,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import React from "react";
import { matchSorter } from "match-sorter";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { DataTablePagination } from "~/components/ui/table-pagination";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

function filter(
  data: Array<{
    [k: string]: unknown;
  }>,
  value: string
): Array<{
  [k: string]: unknown;
}> {
  console.log({ value, keys: Object.keys(data?.[0] ?? {}) });
  return matchSorter(data, value, {
    keys: Object.keys(data?.[0] ?? {}),
    threshold: matchSorter.rankings.CONTAINS,
  });
}

export function DataTable<TData, TValue>({
  columns,
  data,
  text,
}: DataTableProps<TData, TValue> & { text: string }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [search, setSearch] = React.useState("");

  const [_data, setData] = React.useState(data || []);
  const content = React.useMemo(() => [..._data], [_data]);
  React.useEffect(
    function syncData() {
      setData(data);
    },
    [data]
  );

  const table = useReactTable({
    data: content,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { value } = e.target;
    if (value === "") {
      setData(data);
    } else {
      setData(filter(data as { [k: string]: unknown }[], value) as TData[]);
    }
    setSearch(e.target.value);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row flex-wrap w-full mb-2">
          <div className="w-full md:w-1/2 lg:w-2/3 inline-flex">
            <h2 className="text-base leading-normal text-gray-600 my-auto">
              Buscar {text.toLowerCase()}
            </h2>
          </div>
          <div className="w-full md:w-1/2 lg:w-1/3">
            <label className="relative">
              <span className="sr-only">Buscador</span>
              <input
                name="search"
                type="search"
                value={search}
                onChange={onChange}
                placeholder="Buscador"
                className="border-gray-200 border w-full h-10 px-5 pr-10 rounded-full text-sm focus:outline-none text-gray-600 placeholder-gray-400"
              />
              <button
                type="button"
                className="absolute right-0 top-0 mt-1 mr-4"
              >
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </label>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No se encontraron resultados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-end space-x-2 py-4">
        <DataTablePagination table={table} />
      </CardFooter>
    </Card>
  );
}
