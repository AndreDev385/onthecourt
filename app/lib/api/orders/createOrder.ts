import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function createOrder(
  input: CreateOrderInput
): Promise<ApiResponse<Response>> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: CREATE_ORDER,
      variables: { data: input },
    }),
  });

  const { data, errors } = await response.json();
  return { data: data?.createOrder, errors };
}

type CreateOrderInput = {
  shopCartId: string;
  userId: string;
  charges: {
    method: string;
    bank: string;
    capture: string;
    ref: string;
    amount: number;
  }[];
  phone: string;
  address: string;
  rate: number;
  promoCode: string;
  shipping: string;
};

type Response = {
  _id: string;
};

const CREATE_ORDER = `#graphql
  mutation CREATE_ORDER($data: CreateOrderInput!) {
    createOrder(data: $data) {
      _id
    }
  }
`;
