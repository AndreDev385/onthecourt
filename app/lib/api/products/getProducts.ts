import { API_URL, PAGINATION_CONFIG } from "../config";
import { ApiResponse } from "../response";

export async function getProducts(
  page: number = 1,
  filter: {
    brand: string | null;
    categories?: string[];
  }
): Promise<ApiResponse<Response>> {
  if (filter.categories?.length === 0) delete filter.categories;
  const cleanFilters = removeFalsyValues(filter);
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GET_PRODUCTS,
      variables: {
        page,
        perPage: PAGINATION_CONFIG.limit,
        filter: {
          isService: false,
          ...cleanFilters,
        },
      },
    }),
  });

  const { data, errors } = await response.json();
  return { data: data?.productPagination, errors };
}

function removeFalsyValues(
  obj: Record<string, unknown>
): Record<string, unknown> {
  const newObj: Record<string, unknown> = {};
  Object.entries(obj).forEach(([key, value]) => {
    if (value != undefined && value != null && value != "") newObj[key] = value;
  });
  return newObj;
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
