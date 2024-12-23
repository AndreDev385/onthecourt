import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function updateCurrency(
  record: UpdateCurrencyInput | ToggleActiveCurrency
): Promise<ApiResponse<null>> {
  const _id = record._id;
  delete record._id;
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: UPDATE_CURRENCY,
      variables: { record, filter: { _id } },
    }),
  });

  const { errors } = await response.json();
  return { data: null, errors };
}

type UpdateCurrencyInput = {
  _id?: string;
  name: string;
  symbol: string;
  rate: number;
};

type ToggleActiveCurrency = {
  _id?: string;
  active: boolean;
};

export const UPDATE_CURRENCY = `#graphql
  mutation UPDATE_CURRENCY(
    $record: UpdateOneCurrencyInput!
    $filter: FilterUpdateOneCurrencyInput!
  ) {
    updateCurrency(record: $record, filter: $filter) {
      record {
        _id
      }
    }
  }
`;
