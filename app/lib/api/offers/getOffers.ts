import { API_URL, PAGINATION_CONFIG } from "../config";
import { ApiResponse } from "../response";

export async function getOffers(page: number): Promise<ApiResponse<Response>> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GET_SALES,
      variables: {
        data: {
          page,
          perPage: PAGINATION_CONFIG.limit,
        },
      },
    }),
  });
  const { data, errors } = await response.json();
  return { data, errors };
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
    photos: string[];
    _id: string;
    variantValues: {
      price: number;
    };
  }[];
};

const GET_SALES = `#graphql
  query GET_SALES($data: ProductPaginationSalesInput!) {
    productPaginationSales(data: $data) {
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
