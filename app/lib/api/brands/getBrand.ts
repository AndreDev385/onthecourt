import { Brand } from "~/types";
import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function getBrand(_id: string): Promise<ApiResponse<Brand>> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GET_BRAND,
      variables: { filter: { _id } },
    }),
  });

  const { data, errors } = await response.json();
  return { data: data.brand, errors };
}

const GET_BRAND = `#graphql
  query GET_BRAND($filter: FilterFindOneBrandInput!) {
    brand(filter: $filter) {
      _id
      name
      active
      _id
    }
  }
`;
