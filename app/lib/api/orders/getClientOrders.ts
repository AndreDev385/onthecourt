import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function getClientOrders(
  clientId: string
): Promise<ApiResponse<Response[]>> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: GET_ORDERS,
      variables: {
        filter: { client: clientId },
      },
    }),
  });

  const { data, errors } = await response.json();
  return { errors, data: data?.orders };
}

type Response = {
  _id: string;
  status: number;
  shipping: {
    name: string;
  };
  total: number;
  products: {
    photo: string;
    title: string;
  }[];
};

const GET_ORDERS = `#graphql
query Orders($filter: FilterFindManyOrderInput) {
  orders(filter: $filter) {
    _id
    status
    shipping {
      name
    }
    total
    products {
      photo
      title
    }
  }
}`;
