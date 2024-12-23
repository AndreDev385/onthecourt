import { Currency } from "~/types";
import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function getCurrencies(): Promise<ApiResponse<Currency[]>> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GET_CURRENCIES,
    }),
  });

  const { data, errors } = await response.json();
  return { data: data?.currencies, errors };
}

export const GET_CURRENCIES = `#graphql
  query GET_CURRENCIES($skip: Int, $limit: Int) {
    currencies(skip: $skip, limit: $limit) {
      _id
      name
      rate
      symbol
      active
    }
  }
`;
