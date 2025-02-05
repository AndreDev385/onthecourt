import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function updateCarouselData(
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
          carouselImages: input.carouselImages,
        },
      },
    }),
  });
  const { errors } = await response.json();
  return { errors, data: null };
}

type Input = {
  carouselImages: {
    title: string;
    description: string;
    url: string;
  }[];
};

const UPDATE_CONFIG = `#graphql
  mutation UPDATE_CONFIG($updateData: UpdateSettingInput) {
    updateSetting(data: $updateData) {
      carouselImages {
        title
        description
        url
      }
    }
  }
`;
