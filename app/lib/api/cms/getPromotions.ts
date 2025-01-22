import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function getPromotions(): Promise<ApiResponse<Response>> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: CURRENT_CONFIG,
    }),
  });

  const { errors, data } = await response.json();
  return { errors, data: data?.currentSetting };
}

type Response = {
  promotions: {
    title: string;
    description: string;
    url: string;
  }[];
};

const CURRENT_CONFIG = `#graphql
  query CURRENT_CONFIG {
    currentSetting {
      promotions {
        title
        description
        url
      }
    }
  }
`;
