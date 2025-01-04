import { Supplier } from "~/types";
import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function getSupplier(id: string): Promise<ApiResponse<Supplier>> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GET_SUPPLIER,
      variables: { filter: { _id: id } },
    }),
  });

  const { data, errors } = await response.json();
  return { data: data?.supplier, errors };
}

export const GET_SUPPLIER = `#graphql
  query GET_SUPPLIER($filter: FilterFindOneSupplierInput!) {
    products(filter: { active: true }) {
      _id
      title
    }
    supplier(filter: $filter) {
      _id
      name
      active
      products {
        _id
        title
      }
    }
  }
`;
