import { PRIVILEGES } from "~/lib/constants";
import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function signUp(
  input: SignUpInput
): Promise<ApiResponse<{ token: string }>> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: SIGN_UP,
      variables: { ...input, privilege: PRIVILEGES.Cliente, newsLetter: false },
    }),
  });

  const { data, errors } = await response.json();
  return { data: data?.signUp, errors };
}

type SignUpInput = {
  email: string;
  password: string;
  name: string;
};

const SIGN_UP = `#graphql
  mutation SIGN_UP(
    $email: String!
    $password: String!
    $name: String!
    $privilege: Int!
    $newsLetter: Boolean
  ) {
    signUp(
      name: $name
      email: $email
      password: $password
      privilege: $privilege
      commission: 0
      newsLetter: $newsLetter
    ) {
      token
    }
  }
`;
