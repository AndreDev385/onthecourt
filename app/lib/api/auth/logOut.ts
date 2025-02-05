import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function logOut(
  token: string
): Promise<ApiResponse<{ success: boolean }>> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: token,
    },
    body: JSON.stringify({
      query: SIGN_OUT,
    }),
  });

  const { data, errors } = await response.json();
  return { data: data?.signOut, errors };
}

const SIGN_OUT = `#graphql
  mutation SIGN_OUT {
    signOut {
      success
    }
  }
`;
