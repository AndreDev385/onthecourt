import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import ErrorDisplay from "~/components/shared/error";
import { getOrder } from "~/lib/api/orders/getOrder";
import { formatMoney, mapStatusToClientText } from "~/lib/utils";

export async function loader({ params }: LoaderFunctionArgs) {
  invariant(params.id, "Ha ocurrido un error al obtener el pedido");
  const { data, errors } = await getOrder(params.id);
  if (errors && Object.values(errors).length > 0) {
    throw new Response("Ha ocurrido un error al obtener el pedido", {
      status: 404,
    });
  }
  invariant(data, "Ha ocurrido un error al obtener el pedido");
  return data;
}

export default function OrderDetailPage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="container mx-auto py-10 px-8 lg:px-0 h-full">
      <div className="flex flex-col gap-4 justify-center items-center h-full">
        <h1 className="text-2xl lg:text-3xl text-center">
          ¡Gracias por Comprar en{" "}
          <strong className="text-green-500">On The Court!</strong>
        </h1>
        <p className="text-center text-lg">Orden: {data.order._id}</p>
        <p className="text-lg">
          Estado: <strong>{mapStatusToClientText(data.order.status)}</strong>
        </p>
        <p className="text-center font-bold text-lg">
          Total:{" "}
          <strong className="text-green-500">
            ${formatMoney(data.order.total)}
          </strong>
        </p>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return <ErrorDisplay />;
}
