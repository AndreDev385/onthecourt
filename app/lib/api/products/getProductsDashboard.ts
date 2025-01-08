import { API_URL } from "../config";
import { ApiResponse } from "../response";
import { ProductRow } from "~/routes/admin.products.list/columns";

export async function getProductsDashboard(): Promise<
  ApiResponse<ProductRow[]>
> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GET_PRODUCTS,
    }),
  });

  const { data, errors } = await response.json();

  return {
    data: data.products,
    errors,
  };
}

export const GET_PRODUCTS = `#graphql
  query GET_PRODUCTS($filter: FilterFindManyProductInput, $limit: Int) {
    products(filter: $filter, limit: $limit) {
      _id
      title
      active
      isService
      photos
      brand {
        name
      }
    }
  }
`;
