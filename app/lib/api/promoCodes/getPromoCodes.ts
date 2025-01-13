import { PromoCode } from "~/types";
import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function getPromoCodes(): Promise<ApiResponse<PromoCode[]>> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GET_PROMO_CODES,
    }),
  });

  const { data, errors } = await response.json();

  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: data?.promoCodes,
    errors,
  };
}

export const GET_PROMO_CODES = `#graphql
  query GET_PROMO_CODES($skip: Int, $limit: Int) {
    promoCodes(skip: $skip, limit: $limit) {
      _id
      name
      code
      discount
      fixed
      active
    }
  }
`;
