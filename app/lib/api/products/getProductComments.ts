import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function getProductComments(
  productId: string
): Promise<ApiResponse<Response>> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GET_PRODUCT_COMMENTS,
      variables: { id: productId },
    }),
  });

  const { data, errors } = await response.json();
  return { data: data?.productById, errors };
}

type Response = {
  comments: {
    text: string;
    rating: string;
    client: {
      _id: string;
    };
    _id: string;
  }[];
};

const GET_PRODUCT_COMMENTS = `#graphql
query ProductById($id: MongoID!) {
  productById(_id: $id) {
    comments {
      text
      rating
      client {
        _id
      }
      _id
    }
  }
}
`;
