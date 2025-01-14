import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getOrder } from "~/lib/api/orders/getOrder";
import { formatMoney, mapStatusToClientText } from "~/lib/utils";

export async function loader({ params }: LoaderFunctionArgs) {
  invariant(params.id, "Ha ocurrido un error al obtener el pedido");
  const { data, errors } = await getOrder(params.id);
  if (errors && Object.values(errors).length > 0) {
    throw new Error("Ha ocurrido un error al obtener el pedido");
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
        {!data.order.paid ? (
          <div>
            <p>
              En caso de que aun no hayas cancelado tu pedido, realiza el pago
              con los siguientes datos:
            </p>
            <div className="block mt-4 text-black max-w-md mx-auto">
              {data.order?.charges?.[0]?.method === "zelle" ? (
                <div>
                  <p className="text-center">Método de Pago: Zelle</p>
                  <p className="text-center">Correo: lgmacarilu@gmail.com</p>
                </div>
              ) : null}
              {data.order?.charges?.[0]?.method === "paypal" ? (
                <div>
                  <p className="text-center">Método de Pago: PayPal</p>
                  <p className="text-center">
                    Correo: onthecourt.online@gmail.com
                  </p>
                </div>
              ) : null}
              {data.order?.charges?.[0]?.method === "transferencia" ? (
                <div>
                  <div>
                    <p className="text-center">Método de Pago: Pago móvil</p>
                    <p className="text-center">Riccardo González | Banesco</p>
                    <p className="text-center">
                      Telf: 0424-1611221 | C.I. 24.897.839
                    </p>
                  </div>
                  <div>
                    <p className="text-center">
                      Método de Pago: Transferencia Bancaria
                    </p>
                    <p className="text-center">Banesco Cta. Corriente</p>
                    <p className="text-center">
                      Riccardo González C.I. 24.897.839
                    </p>
                    <p className="text-center">
                      Cuenta: 0134 0060 14 0601044459
                    </p>
                    <p className="text-center">
                      Correo: riccardo_glez@hotmail.com
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
