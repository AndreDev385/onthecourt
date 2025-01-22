import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function createComment(input: Input): Promise<ApiResponse<null>> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: CREATE_COMMENT,
      variables: {
        data: input,
      },
    }),
  });
  const { errors } = await response.json();
  return { errors, data: null };
}

const CREATE_COMMENT = `#graphql
  mutation CREATE_COMMENT($data: CreateCommentInput!) {
    createComment(data: $data) {
      _id
    }
  }
`;

type Input = {
  text: string;
  rating: number;
  userId: string;
  productId: string;
};
