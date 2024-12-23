import { Currency } from "~/types";
import { ApiResponse } from "../response";
import { API_URL } from "../config";

export async function createCurrency(
  input: CreateCurrencyInput
): Promise<ApiResponse<Currency>> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: CREATE_CURRENCY,
      variables: { record: input },
    }),
  });

  const { data, errors } = await response.json();
  return { data: data?.createCurrency?.record, errors };
}

type CreateCurrencyInput = {
  name: string;
  symbol: string;
  rate: number;
};

export const CREATE_CURRENCY = `#graphql
  mutation CREATE_CURRENCY($record: CreateOneCurrencyInput!) {
    createCurrency(record: $record) {
      record {
        _id
      }
    }
  }
`;
