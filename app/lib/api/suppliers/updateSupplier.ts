import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function updateSupplier(
  record: UpdateSupplierInput | ToggleActiveSupplier
): Promise<ApiResponse<null>> {
  const _id = record._id;
  delete record._id;
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: UPDATE_SUPPLIER,
      variables: { record, filter: { _id } },
    }),
  });

  const { errors } = await response.json();
  return { data: null, errors };
}

type ToggleActiveSupplier = {
  _id?: string;
  active: boolean;
};

type UpdateSupplierInput = {
  _id: string;
  name: string;
  slug: string;
  active: boolean;
};

export const UPDATE_SUPPLIER = `#graphql
  mutation UPDATE_SUPPLIER(
    $record: UpdateOneSupplierInput!
    $filter: FilterUpdateOneSupplierInput!
  ) {
    updateSupplier(record: $record, filter: $filter) {
      record {
        _id
      }
    }
  }
`;
