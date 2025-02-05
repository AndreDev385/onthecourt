import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function getHomeProducts(): Promise<ApiResponse<Response>> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: HOME_PRODUCTS,
    }),
  });

  if (response.status != 200) {
    return { errors: { message: "Ha ocurrido un error" } }
  }

  const { data, errors } = await response.json();
  return { data: data?.homeProducts, errors };
}

type Response = {
  slug: string;
  title: string;
  description: string;
  isService: boolean;
  photos: string[];
  rating: number;
  _id: string;
  variantValues: {
    price: number;
  }[];
}[];

const HOME_PRODUCTS = `#graphql
  query HOME_PRODUCTS {
    homeProducts {
      slug
      title
      description
      rating
      isService
      photos
      _id
      variantValues {
        price
      }
    }
  }
`;
