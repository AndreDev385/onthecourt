import { Product } from "~/types";
import { ApiResponse } from "../response";
import { API_URL } from "../config";

export async function getEditProductInfo(
  id: string
): Promise<ApiResponse<EditProductInfo>> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GET_PRODUCT,
      variables: {
        filter: {
          _id: id,
        },
      },
      operationName: "GET_PRODUCT",
    }),
  });

  const data = await response.json();

  if (data.errors) {
    return { errors: data.errors };
  }

  return data;
}

type EditProductInfo = {
  brands: Array<{ _id: string; name: string }>;
  categories: Array<{ _id: string; name: string }>;
  locations: Array<{ _id: string; name: string }>;
  product: Product;
};

export const GET_PRODUCT = `#graphql
  query GET_PRODUCT($filter: FilterFindOneProductInput!) {
    locations(filter: { active: true }) {
      name
      _id
    }
    brands(filter: { active: true }) {
      name
      _id
    }
    categories(filter: { active: true }) {
      name
      _id
    }
    product(filter: $filter) {
      title
      description
      dataSheet
      sku
      priority
      isService
      volatileInventory
      active
      photos
      price
      compareAtPrice
      extraInfo {
        name
        value
      }
      brand {
        _id
        name
      }
      model {
        _id
        name
      }
      variants {
        _id
        title
        tags
      }
      variantValues {
        _id
        value {
          variant1
          variant2
          variant3
        }
        price
        compareAtPrice
        quantity
        sku
        location {
          _id
          name
        }
        disabled
      }
      categories {
        name
        _id
      }
      _id
    }
  }
`;
