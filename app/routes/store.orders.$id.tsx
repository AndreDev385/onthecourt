import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import ErrorDisplay from "~/components/shared/error";
import { getOrder } from "~/lib/api/orders/getOrder";
import { PAYMETHODS_VALUES } from "~/lib/constants";
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
        {!data.order.paid ? (
          <div>
            <p>
              En caso de que aun no hayas cancelado tu pedido, realiza el pago
              con los siguientes datos:
            </p>
            <div className="block mt-4 text-black max-w-md mx-auto">
              {data.order?.charges?.[0]?.method === PAYMETHODS_VALUES.zelle ? (
                <div className="text-center">
                  <p>
                    <strong>Zelle</strong>
                  </p>
                  <p className="">Correo: lgmacarilu@gmail.com</p>
                </div>
              ) : null}
              {data.order?.charges?.[0]?.method === PAYMETHODS_VALUES.paypal ? (
                <div className="text-center">
                  <p>
                    <strong>PayPal</strong>
                  </p>
                  <p className="">Correo: onthecourt.online@gmail.com</p>
                </div>
              ) : null}
              {data.order?.charges?.[0]?.method ===
              PAYMETHODS_VALUES.transferencia ? (
                <div className="text-center">
                  <div className="my-2 flex flex-col gap-2">
                    <div>
                      <p>
                        <strong>Transferencia en Bs</strong>
                      </p>
                      <p>Banco:&nbsp;Banco Fondo Común (BFC)</p>
                      <p>Nro. de cuenta:&nbsp;0151 0100 81 1001568121</p>
                      <p>RIF:&nbsp;J50249928-8</p>
                    </div>
                    <div>
                      <p>
                        <strong>Cuenta custodia en divisas (Venezuela)</strong>
                      </p>
                      <p>Banco:&nbsp;Banco Fondo Común (BFC)</p>
                      <p>Nro. de cuenta:&nbsp;0151 0100 83 1001568139</p>
                      <p>RIF:&nbsp;J50249928-8</p>
                    </div>
                  </div>
                </div>
              ) : null}
              {data.order?.charges?.[0]?.method ===
              PAYMETHODS_VALUES.pago_movil ? (
                <div className="text-center">
                  <div className="my-2">
                    <p>
                      <strong>Pago móvil</strong>
                    </p>
                    <p>Banco:&nbsp;Banco Fondo Común (BFC)</p>
                    <p>
                      Titular o razón social:&nbsp;Inversiones On The Court C.A.
                    </p>
                    <p>RIF:&nbsp;J50249928-8</p>
                    <p>Número telefónico:&nbsp;04242710248</p>
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

export function ErrorBoundary() {
  return <ErrorDisplay />;
}
