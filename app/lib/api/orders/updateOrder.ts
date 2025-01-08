import { API_URL } from "../config";

export async function updateOrder(data: UpdateOrderInput) {
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

type UpdateOrderInput = {
  orderId: string;
  status: string;
  paid: boolean;
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
