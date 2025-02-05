import { Brand } from "~/types";
import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function createBrand(name: string): Promise<ApiResponse<Brand>> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: CREATE_BRAND,
      variables: { record: { name } },
    }),
  });

  const { data, errors } = await response.json();
  return { data: data?.createBrand?.record, errors };
}

const CREATE_BRAND = `#graphql
  mutation CREATE_BRAND($record: CreateOneBrandInput!) {
    createBrand(record: $record) {
      record {
        _id
      }
    }
  }
`;
