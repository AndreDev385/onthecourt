import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function getLandingInfo(): Promise<ApiResponse<Response>> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: CURRENT_CONFIG,
    }),
  });

  if (response.status != 200) {
    return { errors: { message: "Ha ocurrido un error" } }
  }

  const { errors, data } = await response.json();
  return { errors, data: data?.currentSetting };
}

type Response = {
  carouselImages: {
    title: string;
    description: string;
    url: string;
  }[];
  promotions: {
    title: string;
    description: string;
    url: string;
  }[];
  banner: {
    text: string;
    active: boolean;
  };
  categories: {
    name: string;
    slug: string;
  }[];
};

const CURRENT_CONFIG = `#graphql
  query CURRENT_CONFIG {
    currentSetting {
      carouselImages {
        title
        description
        url
      }
      promotions {
        title
        description
        url
      }
      banner {
        text
        active
      }
      categories {
        name
        slug
      }
    }
  }
`;
