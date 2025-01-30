import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function changePassword({
  token,
  password,
}: Input): Promise<ApiResponse<Response>> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: CHANGE_PASSWORD,
      variables: {
        data: {
          token,
          password,
        },
      },
    }),
  });

  const { data, errors } = await response.json();
  return { data, errors };
}

type Response = {
  success: boolean;
  err: string;
};

type Input = {
  token: string;
  password: string;
};

const CHANGE_PASSWORD = `#graphql
  mutation CHANGE_PASSWORD($data: ChangePasswordInput!) {
    changePassword(data: $data) {
      success
      err
    }
  }
`;
