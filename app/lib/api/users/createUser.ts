import { API_URL } from "../config";

export async function createUser(record: CreateUserInput) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: CREATE_USER,
      variables: { record },
    }),
  });

  const { data } = await response.json();

  return data.createUser.record;
}

type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  dni: string;
  dniType: string;
  privilege: number;
  commission: number;
};

const CREATE_USER = `#graphql
    mutation CREATE_USER($record: CreateOneUserInput!) {
      createUser(record: $record) {
        record {
          _id
        }
      }
    }
  `;
