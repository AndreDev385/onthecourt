import { Category } from "~/types";
import { ApiResponse } from "../response";
import { API_URL } from "../config";

export async function getCategories(): Promise<ApiResponse<Category[]>> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GET_CATEGORIES,
    }),
  });

  const { data, errors } = await response.json();
  return { data: data?.categories, errors };
}

export const GET_CATEGORIES = `#graphql
  query GET_CATEGORIES($skip: Int, $limit: Int) {
    categories(skip: $skip, limit: $limit) {
      _id
      name
      slug
      active
    }
  }
`;
