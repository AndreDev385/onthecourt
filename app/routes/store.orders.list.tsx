import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { ShoppingCart } from "lucide-react";
import invariant from "tiny-invariant";
import { getSession } from "~/clientSessions";
import ErrorDisplay from "~/components/shared/error";
import OrderSummary from "~/components/store/orders/orderSummary";
import { Button } from "~/components/ui/button";
import { getClientOrders } from "~/lib/api/orders/getClientOrders";
import { getCurrentUser } from "~/lib/api/users/getCurrentUser";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("token")) {
    return redirect("/store");
  }

  const { data, errors } = await getCurrentUser(session.get("token")!);

  if (errors && Object.values(errors).length > 0) {
    throw new Response("Ha ocurrido un error al obtener tus datos de usuario", {
      status: 500,
    });
  }
  invariant(data, "No se pudo obtener el usuario");

  const { data: orders, errors: orderErrors } = await getClientOrders(data._id);
  if (orderErrors && Object.values(orderErrors).length > 0) {
    throw new Response("Ha ocurrido un error al obtener tus pedidos", {
      status: 500,
    });
  }
  invariant(orders, "No se pudo obtener los pedidos");

  return {
    orders,
    user: data.client,
  };
}

export default function OrdersListPage() {
  const { orders } = useLoaderData<typeof loader>();

  return orders.length > 0 ? (
    <div className="container mx-auto py-10 px-8 lg:px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map((order) => (
          <OrderSummary key={order._id} order={order} />
        ))}
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-8 mt-12">
      <h2 className="text-4xl font-bold text-center">
        Aún no has realizado ningún pedido
      </h2>
      <div className="flex flex-col items-center justify-center gap-8">
        <p className="text-lg text-center">
          No hay ningún producto en tu carrito, añade algunos y empieza a
          comprar
        </p>
        <ShoppingCart className="w-24 h-24 text-primary" />
        <Button variant="client" className="p-6 uppercase font-bold">
          <Link to="/store/products">Empieza a comprar</Link>
        </Button>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return <ErrorDisplay />;
}
