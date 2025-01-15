import { ActionFunctionArgs } from "@remix-run/node";
import { useActionData, useRouteLoaderData } from "@remix-run/react";
import React from "react";
import invariant from "tiny-invariant";
import { CancelOrder } from "~/components/admin/orders/cancelOrder";
import { StatusCard } from "~/components/admin/orders/statusCard";
import { useToast } from "~/hooks/use-toast";
import {
  markOrderCanceled,
  markOrderDelivered,
  markOrderPaid,
} from "~/lib/api/orders/updateOrder";

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

export default function OrderSectionPage() {
  const data = useRouteLoaderData<{ order: Order } | undefined>(
    "routes/admin.sales.$orderId"
  );
  const { order } = data ?? {};
  invariant(order, "Ha ocurrido un error al obtener la orden");
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
    <div className="flex flex-col gap-4">
      <StatusCard status={order.status} paid={order.paid} _id={order._id} />
      {order.status !== 7 && <CancelOrder _id={order._id} />}
    </div>
  );
}

type Order = {
  _id: string;
  status: number;
  paid: boolean;
};
