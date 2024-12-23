import { User } from "~/types";
import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function getUsers(): Promise<ApiResponse<User[]>> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GET_USERS,
    }),
  });

  const { data, errors } = await response.json();

  return { data: data.users, errors };
}

const GET_USERS = `#graphql
  query GET_USERS($skip: Int, $limit: Int) {
    users(skip: $skip, limit: $limit) {
      name
      email
      _id
      active
      privilege
    }
  }
`;
