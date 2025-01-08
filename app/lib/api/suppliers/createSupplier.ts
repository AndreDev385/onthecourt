import { Supplier } from "~/types";
import { ApiResponse } from "../response";
import { API_URL } from "../config";

export async function createSupplier(
  record: CreateSupplierInput
): Promise<ApiResponse<Supplier>> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: CREATE_SUPPLIER,
      variables: { record },
    }),
  });

  const { data, errors } = await response.json();
  return { data: data?.createSupplier?.record, errors };
}

export type CreateSupplierInput = {
  name: string;
  products: Array<string>;
};

export const CREATE_SUPPLIER = `#graphql
  mutation CREATE_SUPPLIER($record: CreateOneSupplierInput!) {
    createSupplier(record: $record) {
      record {
        _id
      }
    }
  }
`;
