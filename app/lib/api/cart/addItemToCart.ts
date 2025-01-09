import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function addItemToCart(
  data: AddItemToCartInput
): Promise<ApiResponse<unknown>> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: ADD_ITEM_TO_SHOP_CART,
      variables: { data },
    }),
  });

  const { errors, data: res } = await response.json();
  return { data: res, errors };
}

type AddItemToCartInput = {
  shopCartId: string;
  variantValueId: string;
  productId: string;
  quantity: number;
};

export const ADD_ITEM_TO_SHOP_CART = `#graphql
  mutation ADD_ITEM_TO_SHOP_CART($data: AddItemToCartInput!) {
    addItemToCart(data: $data) {
      client {
        user {
          name
          slug
          _id
        }
      }
      items {
        _id
        variant1
        variant2
        variant3
        product {
          title
          description
          slug
          photos
          price
          compareAtPrice
          _id
          variants {
            title
            tags
          }
          variantValues {
            value {
              variant1
              variant2
              variant3
            }
            price
            compareAtPrice
            quantity
            _id
          }
          extraInfo {
            _id
            name
            value
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
