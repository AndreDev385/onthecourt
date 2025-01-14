import { ORDER_STATUS } from "~/lib/constants";
import { API_URL } from "../config";

async function updateOrder(data: UpdateOrderInput) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: UPDATE_ORDER,
      variables: {
        data,
      },
    }),
  });

  const { errors } = await response.json();
  return { errors };
}

export async function markOrderCanceled(orderId: string) {
  return await updateOrder({
    orderId,
    status: ORDER_STATUS.canceled,
  });
}

export async function markOrderDelivered(orderId: string, paid: boolean) {
  return await updateOrder({
    orderId,
    status: ORDER_STATUS.delivered,
    paid,
    createBill: false,
  });
}

export async function markOrderPaid(orderId: string, status: number) {
  return await updateOrder({
    orderId,
    status:
      status === ORDER_STATUS.delivered
        ? ORDER_STATUS.delivered
        : ORDER_STATUS.paid,
    paid: true,
    createBill: true,
  });
}

type UpdateOrderInput = {
  orderId: string;
  status: number;
  paid?: boolean;
  createBill?: boolean;
};

const UPDATE_ORDER = `#graphql
  mutation UPDATE_ORDER($data: UpdateOrderInput!) {
    updateOrder(data: $data) {
      _id
      status
      paid
    }
  }
`;
