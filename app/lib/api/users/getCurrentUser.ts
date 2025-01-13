import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function getCurrentUser(
  token: string
): Promise<ApiResponse<CurrentUser>> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({
      query: CURRENT_USER,
    }),
  });

  const { data, errors } = await response.json();
  return { data: data.me, errors };
}

export type CurrentUser = {
  _id: string;
  name: string;
  client: {
    _id: string;
    shopCart: {
      _id: string;
      items: {
        _id: string;
      }[];
    };
  };
};

const CURRENT_USER = `#graphql
query CURRENT_USER {
  me {
    _id
    name
    client {
      _id
      shopCart {
        _id
        items {
          _id
        }
      }
    }
  }
}
`;
