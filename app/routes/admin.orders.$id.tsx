import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import React from "react";
import invariant from "tiny-invariant";
import { CancelOrder } from "~/components/admin/orders/cancelOrder";
import ChargeCard from "~/components/admin/orders/chargeCard";
import { ClientCard } from "~/components/admin/orders/clientCard";
import { ProductTable } from "~/components/admin/orders/productTable";
import { StatusCard } from "~/components/admin/orders/statusCard";
import { useToast } from "~/hooks/use-toast";
import { getAdminDetailOrder } from "~/lib/api/orders/getAdminDetailOrder";
import {
  markOrderCanceled,
  markOrderDelivered,
  markOrderPaid,
} from "~/lib/api/orders/updateOrder";

export async function loader({ params }: LoaderFunctionArgs) {
  invariant(params.id, "Ha ocurrido un error al obtener la orden");
  const { data, errors } = await getAdminDetailOrder(params.id);
  if (errors && Object.values(errors).length > 0) {
    throw new Error("Ha ocurrido un error al obtener la orden");
  }
  invariant(data, "Ha ocurrido un error al obtener la orden");
  return data;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const intent = formData.get("intent");
  const orderId = formData.get("_id");
  const paid = formData.get("paid");
  const status = formData.get("status");

  let error: string = "";

  if (intent === UPDATE_ORDER_ACTIONS.markDelivered) {
    const { errors } = await markOrderDelivered(
      String(orderId),
      paid === "paid"
    );
    if (errors && Object.values(errors).length > 0) {
      error = "Ha ocurrido un error al actualizar la orden";
    }
  }

  if (intent === UPDATE_ORDER_ACTIONS.markPaid) {
    const { errors } = await markOrderPaid(String(orderId), Number(status));
    if (errors && Object.values(errors).length > 0) {
      error = "Ha ocurrido un error al actualizar la orden";
    }
  }

  if (intent === UPDATE_ORDER_ACTIONS.markCaceled) {
    const { errors } = await markOrderCanceled(String(orderId));
    if (errors && Object.values(errors).length > 0) {
      error = "Ha ocurrido un error al actualizar la orden";
    }
  }

  if (error) {
    return { error, success: false };
  }

  return { success: true };
}

export const UPDATE_ORDER_ACTIONS = {
  markCaceled: "markCaceled",
  markPaid: "markPaid",
  markDelivered: "markDelivered",
};

export default function OrderDetailPage() {
  const { order } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const { toast } = useToast();

  console.log(order.status, "STATUS");

  React.useEffect(() => {
    if (actionData?.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: actionData.error,
      });
    }

    if (actionData?.success) {
      toast({
        title: "Éxito",
        description: "La orden ha sido actualizada",
      });
    }
  }, [actionData, toast]);

  return (
    <div className="mt-8">
      <section className="flex flex-col flex-wrap mx-auto px-4">
        <article className="grid grid-cols-1 md:grid-cols-[1fr,0.5fr] gap-4 w-full">
          <div className="w-full flex flex-col gap-4">
            <ProductTable order={order} />
            <StatusCard
              status={order.status}
              paid={order.paid}
              _id={order._id}
            />
            {order?.status !== 7 && <CancelOrder _id={order._id} />}
          </div>
          <div className="w-full flex flex-col gap-4 order-first md:order-last">
            <ClientCard
              name={order.client.name ?? ""}
              email={order.client.email ?? ""}
              phone={order.phone ?? ""}
            />
            <ChargeCard charges={order.charges} />
          </div>
        </article>
      </section>
    </div>
  );
}
