import { User } from "~/types";
import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function createUser(
  record: CreateUserInput
): Promise<ApiResponse<User>> {
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

  const { data, errors } = await response.json();

  return { data: data?.createUser?.record, errors };
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
