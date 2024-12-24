import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function updateShipping(
  record: UpdateShippingInput | ToggleActiveShipping
): Promise<ApiResponse<null>> {
  const _id = record._id;
  delete record._id;
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: UPDATE_SHIPPING,
      variables: { record, filter: { _id } },
    }),
  });

  const { errors } = await response.json();
  console.log(errors, "errors api call");
  return { data: null, errors };
}

type ToggleActiveShipping = {
  _id?: string;
  active: boolean;
};

type UpdateShippingInput = {
  _id: string;
  name: string;
  price: number;
};

export const UPDATE_SHIPPING = `#graphql
  mutation UPDATE_SHIPPING(
    $record: UpdateOneShippingInput!
    $filter: FilterUpdateOneShippingInput!
  ) {
    updateShipping(record: $record, filter: $filter) {
      record {
        _id
      }
    }
  }
`;
