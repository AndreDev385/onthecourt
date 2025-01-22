import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function updatePromotions(
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
          promotions: input.promotions,
        },
      },
    }),
  });
  const { errors, data } = await response.json();
  console.log({ data: data.updateSetting });
  return { errors, data: null };
}

type Input = {
  promotions: {
    title: string;
    description: string;
    url: string;
  }[];
};

const UPDATE_CONFIG = `#graphql
  mutation UPDATE_CONFIG($updateData: UpdateSettingInput) {
    updateSetting(data: $updateData) {
      promotions {
        title
        description
        url
      }
    }
  }
`;
