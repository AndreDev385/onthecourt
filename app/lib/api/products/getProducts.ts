import { API_URL } from "../config";
import { ApiResponse } from "../response";

export async function getProducts(
  page: number = 1,
  perPage: number = 10
): Promise<ApiResponse<Response>> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GET_PRODUCTS,
      variables: {
        page,
        perPage,
        filter: {},
      },
    }),
  });

  const { data, errors } = await response.json();
  return { data: data.productPagination, errors };
}

type Response = {
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    pageCount: number;
    itemCount: number;
  };
  items: {
    slug: string;
    title: string;
    description: string;
    isService: boolean;
    rating: number;
    photos: string[];
    _id: string;
    variantValues: {
      price: number;
    }[];
  }[];
};

const GET_PRODUCTS = `#graphql
  query GET_PRODUCTS(
    $page: Int!
    $perPage: Int!
    $filter: FilterFindManyProductInput!
  ) {
    productPagination(page: $page, perPage: $perPage, filter: $filter) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        pageCount
        itemCount
      }
      items {
        slug
        title
        description
        rating
        isService
        photos
        _id
        variantValues {
          price
        }
      }
    }
  }
`;
