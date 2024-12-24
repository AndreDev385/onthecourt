import { Shipping } from "~/types";
import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function getShippings(): Promise<ApiResponse<Shipping[]>> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GET_SHIPPINGS,
    }),
  });

  const { data, errors } = await response.json();
  return { data: data?.shippings, errors };
}

export const GET_SHIPPINGS = `#graphql
  query GET_SHIPPINGS($skip: Int, $limit: Int) {
    shippings(skip: $skip, limit: $limit) {
      _id
      name
      price
      active
    }
  }
`;
