import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function updateBanner(input: Input): Promise<ApiResponse<null>> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: UPDATE_CONFIG,
      variables: {
        updateData: {
          banner: input,
        },
      },
    }),
  });
  const { errors } = await response.json();
  return { errors, data: null };
}

type Input = {
  text: string;
  active: boolean;
};

const UPDATE_CONFIG = `#graphql
  mutation UPDATE_CONFIG($updateData: UpdateSettingInput) {
    updateSetting(data: $updateData) {
      banner {
        text
        active
      }
    }
  }
`;
