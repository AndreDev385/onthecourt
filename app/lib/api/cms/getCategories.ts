import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function getFeaturedCategories(): Promise<ApiResponse<Response>> {
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
  categories: {
    _id: string;
    name: string;
    slug: string;
  }[];
};

const CURRENT_CONFIG = `#graphql
  query CURRENT_CONFIG {
    currentSetting {
      categories {
        _id
        name
        slug
      }
    }
  }
`;
