import { PromoCode } from "~/types";
import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function getPromoCode(
  id: string
): Promise<ApiResponse<PromoCode>> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GET_PROMO_CODE,
      variables: { filter: { _id: id } },
    }),
  });

  const { data, errors } = await response.json();

  // map fixed and percentage to isFixed
  return {
    data: { ...data?.promoCode, isFixed: data.promoCode.fixed },
    errors,
  };
}

export const GET_PROMO_CODE = `#graphql
  query GET_PROMO_CODE($filter: FilterFindOnePromoCodeInput!) {
    promoCode(filter: $filter) {
      _id
      name
      code
      discount
      fixed
      percentage
      expirationDate
      active
      _id
    }
  }
`;
