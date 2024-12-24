import { Shipping } from "~/types";
import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function createShipping(
  name: string,
  price: number
): Promise<ApiResponse<Shipping>> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: CREATE_SHIPPING,
      variables: { record: { name, price } },
    }),
  });

  const { data, errors } = await response.json();
  return { data: data?.createShipping?.record, errors };
}

export type CreateShippingInput = {
  name: string;
  price: number;
};

export const CREATE_SHIPPING = `#graphql
  mutation CREATE_SHIPPING($record: CreateOneShippingInput!) {
    createShipping(record: $record) {
      record {
        _id
      }
    }
  }
`;
