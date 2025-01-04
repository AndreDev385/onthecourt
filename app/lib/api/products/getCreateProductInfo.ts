import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function getCreateProductInfo(): Promise<
  ApiResponse<CreateProductInfo>
> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GET_CREATE_PRODUCT_INFO,
    }),
  });

  const { data, errors } = await response.json();

  return {
    data,
    errors,
  };
}

export type CreateProductInfo = {
  brands: Array<{ _id: string; name: string }>;
  categories: Array<{ _id: string; name: string }>;
  locations: Array<{ _id: string; name: string }>;
};

export const GET_CREATE_PRODUCT_INFO = `#graphql
  query GET_CREATE_PRODUCT_INFO {
    locations(filter: { active: true }) {
      _id
      name
    }
    brands(filter: { active: true }) {
      _id
      name
    }
    categories(filter: { active: true }) {
      _id
      name
    }
  }
`;
