import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function updatePromoCode(
  record: UpdatePromoCodeInput | ToggleActivePromoCode
): Promise<ApiResponse<null>> {
  const _id = record._id;
  delete record._id;
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: UPDATE_PROMO_CODE,
      variables: { record, filter: { _id } },
    }),
  });

  const { errors } = await response.json();
  return { data: null, errors };
}

type ToggleActivePromoCode = {
  _id?: string;
  active: boolean;
};

type UpdatePromoCodeInput = {
  _id: string;
  name: string;
  code: string;
  discount: number;
  fixed: boolean;
  percentage: boolean;
  expirationDate: Date;
};

export const UPDATE_PROMO_CODE = `#graphql
  mutation UPDATE_PROMO_CODE(
    $record: UpdateOnePromoCodeInput!
    $filter: FilterUpdateOnePromoCodeInput!
  ) {
    updatePromoCode(record: $record, filter: $filter) {
      record {
        _id
        name
      }
    }
  }
`;
