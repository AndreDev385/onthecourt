import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useLocation } from "@remix-run/react";
import invariant from "tiny-invariant";
import ChargeCard from "~/components/admin/orders/chargeCard";
import { ClientCard } from "~/components/admin/orders/clientCard";
import { ProductTable } from "~/components/admin/orders/productTable";
import { Button } from "~/components/ui/button";
import { getAdminDetailOrder } from "~/lib/api/orders/getAdminDetailOrder";

export async function loader({ params }: LoaderFunctionArgs) {
  invariant(params.orderId, "Ha ocurrido un error al obtener la orden");
  const { data, errors } = await getAdminDetailOrder(params.orderId);
  if (errors && Object.values(errors).length > 0) {
    throw new Error("Ha ocurrido un error al obtener la orden");
  }
  invariant(data, "Ha ocurrido un error al obtener la orden");
  return data;
}

export default function OrderDetailPage() {
  const { order } = useLoaderData<typeof loader>();
  const location = useLocation();

  const routes = [
    {
      path: `/admin/sales/${order._id}/order`,
      label: "Estado",
    },
    {
      path: `/admin/sales/${order._id}/delivery-note`,
      label: "Nota de entrega",
    },
    {
      path: `/admin/sales/${order._id}/invoice`,
      label: "Factura",
    },
  ];

  return (
    <div className="my-8">
      <section className="flex flex-col px-4">
        {/* Tabs */}
        <div>
          <ul className="flex gap-4 mb-4 pb-2 border-b border-gray-200">
            {routes.map((route) => (
              <li key={route.path}>
                <Button variant="ghost">
                  <Link
                    prefetch="intent"
                    className={`text-lg ${
                      location.pathname === route.path
                        ? "text-black font-bold"
                        : "text-gray-500"
                    }`}
                    to={route.path}
                  >
                    {route.label}
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        </div>
        <article className="grid grid-cols-1 md:grid-cols-[1fr,0.5fr] gap-4 w-full">
          <div className="w-full flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <ClientCard
                name={order.client.name ?? ""}
                email={order.client.email ?? ""}
                phone={order.phone ?? ""}
              />
              <ChargeCard charges={order.charges} />
            </div>
            <div>
              <ProductTable order={order} />
            </div>
          </div>
          <div className="w-full flex flex-col gap-4 order-first md:order-last">
            <Outlet />
          </div>
        </article>
      </section>
    </div>
  );
}
