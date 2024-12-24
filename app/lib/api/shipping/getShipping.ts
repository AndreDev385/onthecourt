import { Shipping } from "~/types";
import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function getShipping(id: string): Promise<ApiResponse<Shipping>> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GET_SHIPPING,
      variables: { filter: { _id: id } },
    }),
  });

  const { data, errors } = await response.json();
  return { data: data?.shipping, errors };
}

export const GET_SHIPPING = `#graphql
  query GET_SHIPPING($filter: FilterFindOneShippingInput!) {
    shipping(filter: $filter) {
      _id
      name
      price
      active
      _id
    }
  }
`;
