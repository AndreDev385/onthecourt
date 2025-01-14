import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function getAdminDetailOrder(
  orderId: string
): Promise<ApiResponse<Response>> {
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
  return { errors, data };
}

type Response = {
  currencies: {
    _id: string;
    name: string;
  }[];
  order: {
    _id: string;
    status: number;
    paid: boolean;
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    commission: number;
    phone: string;
    products: {
      title: string;
      photo: string;
      variant1: string;
      variant2: string;
      variant3: string;
      price: number;
      quantity: number;
      location: {
        name: string;
      };
    }[];
    client: {
      name: string;
      email: string;
    };
    charges: {
      ref: string;
      bank: string;
      method: string;
      amount: number;
      createdAt: string;
    }[];
    updatedAt: string;
    createdAt: string;
  };
};

export const GET_ORDER = `#graphql
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
