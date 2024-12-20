import { Brand } from "~/types";
import { API_URL } from "../config";

export async function getBrands(): Promise<Brand[]> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GET_BRANDS,
    }),
  });

  const { data } = await response.json();
  return data.brands;
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
