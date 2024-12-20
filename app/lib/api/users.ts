import { API_URL } from "./config";

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

export async function getUsers() {
  console.log(`${GET_USERS}`);
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
