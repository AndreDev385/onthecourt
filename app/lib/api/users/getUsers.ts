import { API_URL } from "../config";

export async function getUsers() {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GET_USERS,
    }),
  });

  const { data } = await response.json();

  return data.users;
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
