import { Brand } from "~/types";
import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function getBrands(): Promise<ApiResponse<Brand[]>> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GET_BRANDS,
    }),
  });

  const { data, errors } = await response.json();
  return { data: data?.brands, errors };
}

const GET_BRANDS = `#graphql
  query GET_BRANDS($skip: Int, $limit: Int) {
    brands(skip: $skip, limit: $limit) {
      _id
      name
      active
    }
  }
`;
