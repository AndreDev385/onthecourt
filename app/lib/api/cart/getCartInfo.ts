import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function getCartInfo(
  shopCartId: string
): Promise<ApiResponse<ShopCartInfo>> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GET_CART_INFO,
      variables: {
        filter: {
          _id: shopCartId,
        },
      },
    }),
  });

  const { data, errors } = await response.json();
  return { data: data?.shopCart, errors };
}

export type ShopCartInfo = {
  _id: string;
  items: CartItem[];
};

export type CartItem = {
  _id: string;
  variant1: string;
  variant2?: string;
  variant3?: string;
  product: {
    title: string;
    description: string;
    slug: string;
    variants: {
      title: string;
    }[];
    brand?: {
      _id: string;
      name: string;
      slug: string;
    };
    categories: {
      _id: string;
      name: string;
      slug: string;
    }[];
  };
  quantity: number;
  price: number;
  photo: string;
};

const GET_CART_INFO = `#graphql
query ShopCart($filter: FilterFindOneShopCartInput) {
  shopCart(filter: $filter) {
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
        variants {
          title
        }
        brand {
          _id
          name
          slug
        }
        categories {
          _id
          name
          slug
        }
      }
      quantity
      price
      photo
    }
  }
}
`;
