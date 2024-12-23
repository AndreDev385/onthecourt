import { Category } from "~/types";
import { ApiResponse } from "../response";
import { API_URL } from "../config";

export async function getCategory(id: string): Promise<ApiResponse<Category>> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GET_CATEGORY,
      variables: { filter: { _id: id } },
    }),
  });

  const { data, errors } = await response.json();
  return { data: data?.category, errors };
}

export const GET_CATEGORY = `#graphql
  query GET_CATEGORY($filter: FilterFindOneCategoryInput!) {
    category(filter: $filter) {
      _id
      name
      photo
      active
      products {
        title
      }
    }
  }
`;
