import { Order } from "~/types";
import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function getOrder(orderId: string): Promise<ApiResponse<Order>> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: GET_ORDER,
      variables: {
        filter: { _id: orderId },
      },
    }),
  });

  const { data, errors } = await response.json();
  return { errors, data: data?.order };
}

const GET_ORDER = `#graphql
  query GET_ORDER($filter: FilterFindOneOrderInput!) {
    currencies(filter: { active: true }) {
      _id
      name
    }
    order(filter: $filter) {
      _id
      status
      paid
      subtotal
      tax
      discount
      total
      commission
      phone
      products {
        title
        photo
        variant1
        variant2
        variant3
        price
        quantity
        location {
          name
        }
      }
      client {
        name
        email
      }
      seller {
        name
      }
      charges {
        ref
        bank
        method
        amount
        createdAt
      }
      updatedAt
      createdAt
    }
  }
`;
