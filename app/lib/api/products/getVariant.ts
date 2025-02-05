import { VariantValue } from "~/types";
import { ApiResponse } from "../response";
import { API_URL } from "../config";

export async function getVariant(
  variantId: string
): Promise<ApiResponse<VariantValue>> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GET_VARIANT_VALUE,
      variables: {
        variantValueID: variantId,
      },
    }),
  });

  const { data, errors } = await response.json();
  return { data: data?.variantValue, errors };
}

const GET_VARIANT_VALUE = `#graphql
  query GET_VARIANT_VALUE($variantValueID: MongoID!) {
    variantValue(filter: { _id: $variantValueID }) {
      value {
        variant1
        variant2
        variant3
      }
      price
      compareAtPrice
      quantity
      photo
      sku
      disabled
      _id
    }
}
`;
