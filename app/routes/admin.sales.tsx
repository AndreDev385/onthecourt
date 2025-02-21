import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { format } from "date-fns";
import invariant from "tiny-invariant";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { getOrderForAdminTable } from "~/lib/api/orders/getOrdersForAdminTable";
import { formatMoney, mapStatusToText } from "~/lib/utils";

export async function loader() {
  const { data, errors } = await getOrderForAdminTable();

  if (errors && Object.values(errors).length > 0) {
    throw new Error("Error al cargar ordenes");
  }
  invariant(data, "Error al cargar ordenes");
  return data;
}

export default function SalesLayout() {
  const orders = useLoaderData<typeof loader>();

  return (
    <div className="my-8 px-4">
      <div className="mb-4">
        <h1 className="text-gray-600 text-2xl font-semibold">Ventas</h1>
      </div>
      <Card>
        <CardHeader>
          <h2 className="text-xl text-gray-600">Lista de Ordenes</h2>
        </CardHeader>
        <CardContent>
          {orders.length > 0 ? (
            <div className="grid grid-cols-[auto,1fr] gap-4 border border-gray-200 rounded-lg min-h-[60vh]">
              {/* Orders List */}
              <div className="sticky h-full overflow-y-scroll p-4">
                {orders.map((o) => (
                  <Link
                    key={o._id}
                    to={`/admin/sales/${o._id}`}
                    prefetch="intent"
                  >
                    <div
                      className="flex flex-col gap-2 border-b border-gray-200 py-4 px-2 last:border-none w-[300px] hover:bg-gray-100"
                    >
                      <div className="flex justify-between">
                        <p>{o.client.name}</p>
                        <p>${formatMoney(o.total)}</p>
                      </div>
                      <div className="flex justify-between">
                        <p>{format(o.createdAt, "dd/MM/yyyy")}</p>
                        <p>{mapStatusToText(o.status)}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              {/* Detail */}
              <Outlet />
            </div>
          ) : (
            <div className="flex items-center justify-center my-12">
              <h2 className="text-4xl font-bold text-center">
                Aún no se ha concretado ninguna orden
              </h2>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
