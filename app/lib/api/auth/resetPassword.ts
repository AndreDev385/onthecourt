import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function resetPassword(
  email: string
): Promise<ApiResponse<Response>> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: RESET_PASSWORD,
      variables: {
        data: {
          email,
        },
      },
    }),
  });

  const { data, errors } = await response.json();
  return { data: data?.resetPassword, errors };
}

type Response = {
  success: boolean;
  err: string;
};

const RESET_PASSWORD = `#graphql
  mutation RESET_PASSWORD($data: ResetPasswordInput!) {
    resetPassword(data: $data) {
      success
      err
    }
  }
`;
