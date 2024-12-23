import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function updateCategory(
  record: ToggleActiveCategory | UpdateCategoryInput
): Promise<ApiResponse<null>> {
  const _id = record._id;
  delete record._id;
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: UPDATE_CATEGORY,
      variables: { record, filter: { _id } },
    }),
  });

  const { errors } = await response.json();
  return { data: null, errors };
}

type ToggleActiveCategory = {
  _id?: string;
  active: boolean;
};

type UpdateCategoryInput = {
  _id: string;
  name: string;
};

export const UPDATE_CATEGORY = `#graphql
  mutation UPDATE_CATEGORY(
    $record: UpdateOneCategoryInput!
    $filter: FilterUpdateOneCategoryInput!
  ) {
    updateCategory(record: $record, filter: $filter) {
      record {
        _id
      }
    }
  }
`;
