import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function removeItemFromCart(
  input: Input
): Promise<ApiResponse<void>> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: REMOVE_ITEM_FROM_CART,
      variables: {
        data: {
          orderProductId: input.orderProductId,
          shopCartId: input.shopCartId,
        },
      },
    }),
  });

  const { errors } = await response.json();
  return { errors };
}

type Input = {
  orderProductId: string;
  shopCartId: string;
};

const REMOVE_ITEM_FROM_CART = `#graphql
  mutation REMOVE_ITEM_FROM_CART($data: RemoveItemFromCartInput!) {
    removeItemFromCart(data: $data) {
      _id
      items {
        _id
        variant1
        variant2
        variant3
        product {
          title
          description
          slug
          brand {
            name
            slug
          }
          categories {
            name
            slug
          }
        }
        quantity
        price
        photo
      }
      createdAt
      updatedAt
    }
  }
`;
