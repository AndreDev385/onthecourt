import { Category } from "~/types";
import { ApiResponse } from "../response";
import { API_URL } from "../config";

export async function createCategory(
  name: string
): Promise<ApiResponse<Category>> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: CREATE_CATEGORY,
      variables: { record: { name } },
    }),
  });

  const { data, errors } = await response.json();
  return { data: data?.createCategory?.record, errors };
}

const CREATE_CATEGORY = `#graphql
  mutation CREATE_CATEGORY($record: CreateOneCategoryInput!) {
    createCategory(record: $record) {
      record {
        _id
      }
    }
  }
`;
