import { PromoCode } from "~/types";
import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function createPromoCode(
  record: CreatePromoCodeInput
): Promise<ApiResponse<PromoCode>> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: CREATE_PROMO_CODE,
      variables: {
        record,
      },
    }),
  });

  const { data, errors } = await response.json();
  return { data: data?.createPromoCode?.record, errors };
}

export type CreatePromoCodeInput = {
  name: string;
  code: string;
  discount: number;
  fixed: boolean;
  percentage: boolean;
  expirationDate: Date;
};

export const CREATE_PROMO_CODE = `#graphql
  mutation CREATE_PROMO_CODE($record: CreateOnePromoCodeInput!) {
    createPromoCode(record: $record) {
      record {
        _id
      }
    }
  }
`;
