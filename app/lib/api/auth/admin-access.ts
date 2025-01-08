import { API_URL } from "../config";

export async function signIn(email: string, password: string) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: SIGN_IN,
      variables: { email, password },
    }),
  });

  const { data, errors } = await response.json();
  return { data: data?.signIn, errors };
}

export const SIGN_IN = `#graphql
  mutation SIGN_IN($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      token
    }
  }
`;
