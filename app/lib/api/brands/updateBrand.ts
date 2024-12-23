import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function updateBrand(
  record: UpdateBrandInput | ToggleActiveBrand
): Promise<ApiResponse<null>> {
  const _id = record._id;
  delete record._id;
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: UPDATE_BRAND,
      variables: { record, filter: { _id } },
    }),
  });

  const { errors } = await response.json();
  return { data: null, errors };
}

type ToggleActiveBrand = {
  _id?: string;
  active: boolean;
};

type UpdateBrandInput = {
  _id: string;
  name: string;
};

const UPDATE_BRAND = `#graphql
  mutation UPDATE_BRAND(
    $record: UpdateOneBrandInput!
    $filter: FilterUpdateOneBrandInput!
  ) {
    updateBrand(record: $record, filter: $filter) {
      record {
        _id
        name
      }
    }
  }
`;
