import { Supplier } from "~/types";
import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function getSuppliers(): Promise<ApiResponse<Supplier[]>> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GET_SUPPLIERS,
    }),
  });

  const { data, errors } = await response.json();
  return { data: data?.suppliers, errors };
}

export const GET_SUPPLIERS = `#graphql
  query GET_SUPPLIERS($skip: Int, $limit: Int) {
    suppliers(skip: $skip, limit: $limit) {
      _id
      name
      active
    }
  }
`;
