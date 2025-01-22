import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function updateFeaturedCategories(
  input: Input
): Promise<ApiResponse<null>> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: UPDATE_CONFIG,
      variables: {
        updateData: {
          categories: input.categories,
        },
      },
    }),
  });
  const { errors } = await response.json();
  return { errors, data: null };
}

type Input = {
  categories: string[];
};

const UPDATE_CONFIG = `#graphql
  mutation UPDATE_CONFIG($updateData: UpdateSettingInput) {
    updateSetting(data: $updateData) {
      categories {
        _id
      }
    }
  }
`;
