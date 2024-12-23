import { Currency } from "~/types";
import { ApiResponse } from "../response";
import { API_URL } from "../config";

export async function getCurrency(id: string): Promise<ApiResponse<Currency>> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GET_CURRENCY,
      variables: { filter: { _id: id } },
    }),
  });

  const { data, errors } = await response.json();
  return { data: data?.currency, errors };
}

export const GET_CURRENCY = `#graphql
  query GET_CURRENCY($filter: FilterFindOneCurrencyInput!) {
    currency(filter: $filter) {
      _id
      name
      symbol
      rate
      active
    }
  }
`;
