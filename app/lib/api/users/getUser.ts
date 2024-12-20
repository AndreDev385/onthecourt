import { API_URL } from "../config";

export async function getUser(_id: string) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GET_USER,
      variables: { filter: { _id } },
    }),
  });

  const { data } = await response.json();
  return data.user;
}

export const GET_USER = `#graphql
  query GET_USER($filter: FilterFindOneUserInput!) {
    user(filter: $filter) {
      name
      email
      _id
      active
      commission
      privilege
      dni
      dniType
    }
  }
`;
