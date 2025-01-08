import { Order } from "~/types";
import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function getOrders(
  skip?: number,
  limit?: number
): Promise<ApiResponse<Order[]>> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: GET_ORDERS,
      variables: {
        skip,
        limit,
      },
    }),
  });

  const { data, errors } = await response.json();
  return { errors, data: data?.orders };
}

const GET_ORDERS = `#graphql
  query GET_ORDERS($skip: Int, $limit: Int) {
    orders(skip: $skip, limit: $limit) {
      _id
      status
      total
      createdAt
      client {
        name
      }
      seller {
        name
      }
    }
  }
`;
